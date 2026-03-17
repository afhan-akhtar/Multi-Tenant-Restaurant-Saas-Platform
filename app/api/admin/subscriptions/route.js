import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/admin/subscriptions - Assign plan to tenant (Super Admin only)
export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tenantId, planId } = body;

    if (!tenantId || !planId) {
      return NextResponse.json(
        { error: "Tenant and plan are required." },
        { status: 400 }
      );
    }

    const [tenant, plan] = await Promise.all([
      prisma.tenant.findUnique({ where: { id: Number(tenantId) } }),
      prisma.subscriptionPlan.findUnique({ where: { id: Number(planId) } }),
    ]);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found." }, { status: 404 });
    }
    if (!plan) {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }
    if (tenant.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Only active tenants can be assigned a subscription." },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const sub = await prisma.$transaction(async (tx) => {
      await tx.tenantSubscription.updateMany({
        where: {
          tenantId: tenant.id,
          status: "ACTIVE",
        },
        data: {
          status: "CANCELLED",
          endDate: startDate,
        },
      });

      return tx.tenantSubscription.create({
        data: {
          tenantId: tenant.id,
          planId: plan.id,
          status: "ACTIVE",
          startDate,
          endDate,
        },
        include: { tenant: true, plan: true },
      });
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: sub.id,
        tenantId: sub.tenantId,
        planId: sub.planId,
        tenantName: sub.tenant?.name,
        planName: sub.plan?.name,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
      },
    });
  } catch (err) {
    console.error("[admin subscriptions create]", err);
    return NextResponse.json({ error: "Failed to create subscription." }, { status: 500 });
  }
}
