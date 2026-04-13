import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import {
  addDays,
  addMonths,
  createInvoiceForSubscription,
  recordInvoicePayment,
  serializeSubscription,
  syncSubscriptionState,
} from "@/lib/subscriptions";

async function requireSuperAdmin(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.type !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function PATCH(req, { params }) {
  try {
    const unauthorized = await requireSuperAdmin(req);
    if (unauthorized) return unauthorized;

    const id = Number(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
    }

    const body = await req.json();
    const action = String(body?.action || "").trim();
    const planId = body?.planId ? Number(body.planId) : null;
    const invoiceId = body?.invoiceId ? Number(body.invoiceId) : null;
    const amount = body?.amount ? Number(body.amount) : null;
    const method = String(body?.method || "MANUAL").trim().toUpperCase();
    const reference = String(body?.reference || "").trim();
    const notes = String(body?.notes || "").trim();

    const existing = await platformPrisma.tenantSubscription.findUnique({
      where: { id },
      include: {
        plan: true,
        tenant: true,
        invoices: {
          include: { payments: true },
          orderBy: [{ periodEnd: "desc" }, { issuedAt: "desc" }],
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
    }

    if (action === "renew") {
      const now = new Date();
      const nextEndDate = addMonths(now, 1);
      const updated = await platformPrisma.tenantSubscription.update({
        where: { id },
        data: {
          status: existing.plan?.trialDays ? "TRIALING" : "ACTIVE",
          startDate: now,
          endDate: nextEndDate,
          trialStartDate: existing.plan?.trialDays ? now : null,
          trialEndDate: existing.plan?.trialDays ? addDays(now, Number(existing.plan.trialDays || 0)) : null,
          gracePeriodEndsAt: addDays(nextEndDate, Number(existing.plan?.graceDays || 0)),
          nextBillingDate: nextEndDate,
          autoRenew: true,
          cancelAtPeriodEnd: false,
        },
        include: { plan: true },
      });

      await createInvoiceForSubscription(updated, {
        periodStart: updated.startDate,
        periodEnd: updated.endDate,
        dueDate: updated.endDate,
        notes: "Invoice created during manual subscription renewal.",
      });

      const subscription = await syncSubscriptionState(platformPrisma, updated.id);
      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(subscription),
      });
    } else if (action === "cancel") {
      const subscription = await platformPrisma.tenantSubscription.update({
        where: { id },
        data: {
          status: "CANCELLED",
          endDate: new Date(),
          cancelAtPeriodEnd: false,
          autoRenew: false,
        },
      });

      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(
          await syncSubscriptionState(platformPrisma, subscription.id)
        ),
      });
    } else if (action === "cancel_at_period_end") {
      const subscription = await platformPrisma.tenantSubscription.update({
        where: { id },
        data: {
          cancelAtPeriodEnd: true,
          autoRenew: false,
        },
      });

      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(
          await syncSubscriptionState(platformPrisma, subscription.id)
        ),
      });
    } else if (action === "expire") {
      const subscription = await platformPrisma.tenantSubscription.update({
        where: { id },
        data: {
          status: "EXPIRED",
          endDate: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(
          await syncSubscriptionState(platformPrisma, subscription.id)
        ),
      });
    } else if (action === "switch_plan") {
      if (!planId) {
        return NextResponse.json({ error: "Plan is required." }, { status: 400 });
      }

      const plan = await platformPrisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return NextResponse.json({ error: "Plan not found." }, { status: 404 });
      }

      const nextGraceEnd = addDays(existing.endDate, Number(plan.graceDays || 0));
      const subscription = await platformPrisma.tenantSubscription.update({
        where: { id },
        data: {
          planId,
          gracePeriodEndsAt: nextGraceEnd,
          status:
            existing.status === "EXPIRED" || existing.status === "CANCELLED"
              ? plan.trialDays > 0
                ? "TRIALING"
                : "ACTIVE"
              : existing.status,
        },
      });

      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(
          await syncSubscriptionState(platformPrisma, subscription.id)
        ),
      });
    } else if (action === "generate_invoice") {
      await createInvoiceForSubscription(existing, {
        notes: notes || "Manual invoice generation from Super Admin.",
      });

      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(
          await syncSubscriptionState(platformPrisma, existing.id)
        ),
      });
    } else if (action === "record_payment") {
      if (!invoiceId) {
        return NextResponse.json({ error: "Invoice is required." }, { status: 400 });
      }

      const subscription = await platformPrisma.$transaction((tx) =>
        recordInvoicePayment(tx, {
          invoiceId,
          amount,
          method,
          reference,
          notes,
        })
      );

      return NextResponse.json({
        success: true,
        subscription: serializeSubscription(subscription),
      });
    } else {
      return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
    }
  } catch (error) {
    console.error("[admin subscriptions update]", error);
    return NextResponse.json({ error: "Failed to update subscription." }, { status: 500 });
  }
}
