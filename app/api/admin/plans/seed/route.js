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
      select: { name: true },
    });
    const existingNames = new Set(existingPlans.map((plan) => plan.name.toLowerCase()));
    const plansToCreate = DEFAULT_SUBSCRIPTION_PLANS.filter(
      (plan) => !existingNames.has(plan.name.toLowerCase())
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
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        commissionPercent: plan.commissionPercent,
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
