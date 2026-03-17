import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

    const { name, monthlyPrice, commissionPercent, features } = parsePlanPayload(await req.json());
    if (!name || Number.isNaN(monthlyPrice) || Number.isNaN(commissionPercent)) {
      return NextResponse.json(
        { error: "Name, monthly price, and commission percent are required." },
        { status: 400 }
      );
    }

    if (monthlyPrice < 0 || commissionPercent < 0 || commissionPercent > 100) {
      return NextResponse.json(
        { error: "Invalid price or commission percent." },
        { status: 400 }
      );
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        monthlyPrice,
        commissionPercent,
        features,
      },
    });

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        name: plan.name,
        monthlyPrice: Number(plan.monthlyPrice),
        commissionPercent: Number(plan.commissionPercent),
        features,
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

    const activeSubscriptions = await prisma.tenantSubscription.count({
      where: { planId: id, status: "ACTIVE" },
    });

    if (activeSubscriptions > 0) {
      return NextResponse.json(
        { error: "This plan is assigned to active subscriptions and cannot be deleted." },
        { status: 400 }
      );
    }

    await prisma.subscriptionPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin plans delete]", error);
    return NextResponse.json({ error: "Failed to delete plan." }, { status: 500 });
  }
}
