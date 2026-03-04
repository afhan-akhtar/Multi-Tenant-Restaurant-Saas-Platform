import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const { name, monthlyPrice, commissionPercent } = body;

    if (!name?.trim() || monthlyPrice == null || commissionPercent == null) {
      return NextResponse.json(
        { error: "Name, monthly price, and commission percent are required." },
        { status: 400 }
      );
    }

    const price = Number(monthlyPrice);
    const commission = Number(commissionPercent);
    if (isNaN(price) || price < 0 || isNaN(commission) || commission < 0 || commission > 100) {
      return NextResponse.json(
        { error: "Invalid price or commission percent." },
        { status: 400 }
      );
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: name.trim(),
        monthlyPrice: price,
        commissionPercent: commission,
        features: {},
      },
    });

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        name: plan.name,
        monthlyPrice: Number(plan.monthlyPrice),
        commissionPercent: Number(plan.commissionPercent),
      },
    });
  } catch (err) {
    console.error("[admin plans create]", err);
    return NextResponse.json({ error: "Failed to create plan." }, { status: 500 });
  }
}
