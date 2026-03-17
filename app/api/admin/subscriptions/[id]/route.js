import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

function addMonth(dateValue) {
  const next = new Date(dateValue);
  next.setMonth(next.getMonth() + 1);
  return next;
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

    const existing = await prisma.tenantSubscription.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
    }

    const data = {};

    if (action === "renew") {
      data.status = "ACTIVE";
      data.startDate = new Date();
      data.endDate = addMonth(data.startDate);
    } else if (action === "cancel") {
      data.status = "CANCELLED";
      data.endDate = new Date();
    } else if (action === "expire") {
      data.status = "EXPIRED";
      data.endDate = new Date();
    } else if (action === "switch_plan") {
      if (!planId) {
        return NextResponse.json({ error: "Plan is required." }, { status: 400 });
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return NextResponse.json({ error: "Plan not found." }, { status: 404 });
      }

      data.planId = planId;
      if (existing.status !== "ACTIVE") {
        data.status = "ACTIVE";
        data.startDate = new Date();
        data.endDate = addMonth(data.startDate);
      }
    } else {
      return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
    }

    const subscription = await prisma.tenantSubscription.update({
      where: { id },
      data,
      include: { tenant: true, plan: true },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        tenantId: subscription.tenantId,
        planId: subscription.planId,
        tenantName: subscription.tenant?.name,
        planName: subscription.plan?.name,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error("[admin subscriptions update]", error);
    return NextResponse.json({ error: "Failed to update subscription." }, { status: 500 });
  }
}
