import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { parsePlanPayload } from "@/lib/subscriptionPlans";

// POST /api/admin/plans - Create subscription plan (Super Admin only)
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
    } = parsePlanPayload(body);

    if (!name?.trim() || !code || monthlyPrice == null || commissionPercent == null) {
      return NextResponse.json(
        { error: "Plan code, name, monthly price, and commission percent are required." },
        { status: 400 }
      );
    }

    const price = Number(monthlyPrice);
    const commission = Number(commissionPercent);
    if (
      isNaN(price) ||
      price < 0 ||
      isNaN(commission) ||
      commission < 0 ||
      commission > 100 ||
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

    const plan = await platformPrisma.subscriptionPlan.create({
      data: {
        code,
        name: name.trim(),
        description: description || null,
        monthlyPrice: price,
        commissionPercent: commission,
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
  } catch (err) {
    console.error("[admin plans create]", err);
    return NextResponse.json({ error: "Failed to create plan." }, { status: 500 });
  }
}
