import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_SUBSCRIPTION_PLANS } from "@/lib/subscriptionPlans";

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingPlans = await prisma.subscriptionPlan.findMany({
      select: { name: true, code: true },
    });
    const legacyNameMap = {
      starter: "basic",
      growth: "premium",
      scale: "enterprise",
    };
    const existingPlanKeys = new Set(
      existingPlans.flatMap((plan) => [
        String(plan.name || "").toLowerCase(),
        String(plan.code || "").toLowerCase(),
        legacyNameMap[String(plan.name || "").toLowerCase()],
      ].filter(Boolean))
    );
    const plansToCreate = DEFAULT_SUBSCRIPTION_PLANS.filter(
      (plan) => !existingPlanKeys.has(plan.name.toLowerCase()) && !existingPlanKeys.has(plan.code.toLowerCase())
    );

    if (plansToCreate.length === 0) {
      return NextResponse.json({
        success: true,
        created: 0,
        message: "Default plans already exist.",
      });
    }

    await prisma.subscriptionPlan.createMany({
      data: plansToCreate.map((plan) => ({
        code: plan.code,
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        commissionPercent: plan.commissionPercent,
        trialDays: plan.trialDays,
        graceDays: plan.graceDays,
        sortOrder: plan.sortOrder,
        features: plan.features,
      })),
    });

    return NextResponse.json({
      success: true,
      created: plansToCreate.length,
      message: `${plansToCreate.length} default plan(s) created.`,
    });
  } catch (error) {
    console.error("[admin plans seed]", error);
    return NextResponse.json({ error: "Failed to seed default plans." }, { status: 500 });
  }
}
