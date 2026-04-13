import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { parsePlanPayload } from "@/lib/subscriptionPlans";

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
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const {
      code,
      name,
      description,
      monthlyPrice,
      commissionPercent,
      trialDays,
      graceDays,
      sortOrder,
      features,
    } = parsePlanPayload(await req.json());
    if (!code || !name || Number.isNaN(monthlyPrice) || Number.isNaN(commissionPercent)) {
      return NextResponse.json(
        { error: "Plan code, name, monthly price, and commission percent are required." },
        { status: 400 }
      );
    }

    if (
      monthlyPrice < 0 ||
      commissionPercent < 0 ||
      commissionPercent > 100 ||
      Number.isNaN(trialDays) ||
      trialDays < 0 ||
      Number.isNaN(graceDays) ||
      graceDays < 0
    ) {
      return NextResponse.json(
        { error: "Invalid billing configuration." },
        { status: 400 }
      );
    }

    const plan = await platformPrisma.subscriptionPlan.update({
      where: { id },
      data: {
        code,
        name,
        description: description || null,
        monthlyPrice,
        commissionPercent,
        trialDays,
        graceDays,
        sortOrder,
        features,
      },
    });

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        code: plan.code,
        name: plan.name,
        description: plan.description,
        monthlyPrice: Number(plan.monthlyPrice),
        commissionPercent: Number(plan.commissionPercent),
        trialDays: plan.trialDays,
        graceDays: plan.graceDays,
        sortOrder: plan.sortOrder,
        features: plan.features,
      },
    });
  } catch (error) {
    console.error("[admin plans update]", error);
    return NextResponse.json({ error: "Failed to update plan." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const unauthorized = await requireSuperAdmin(req);
    if (unauthorized) return unauthorized;

    const id = Number(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const activeSubscriptions = await platformPrisma.tenantSubscription.count({
      where: { planId: id, status: { in: ["TRIALING", "ACTIVE", "GRACE_PERIOD", "PAST_DUE"] } },
    });

    if (activeSubscriptions > 0) {
      return NextResponse.json(
        { error: "This plan is assigned to active subscriptions and cannot be deleted." },
        { status: 400 }
      );
    }

    await platformPrisma.subscriptionPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin plans delete]", error);
    return NextResponse.json({ error: "Failed to delete plan." }, { status: 500 });
  }
}
