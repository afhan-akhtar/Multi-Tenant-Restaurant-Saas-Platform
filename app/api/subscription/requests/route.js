import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = token.tenantId ?? null;
    if (!tenantId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const body = await request.json();
    const requestedPlanId = Number(body?.requestedPlanId);
    const message = String(body?.message || "").trim();

    if (!requestedPlanId) {
      return NextResponse.json({ error: "Requested plan is required." }, { status: 400 });
    }

    const [currentSubscription, requestedPlan, existingPending] = await Promise.all([
      prisma.tenantSubscription.findFirst({
        where: {
          tenantId,
          status: { in: ["TRIALING", "ACTIVE", "GRACE_PERIOD", "PAST_DUE"] },
        },
        orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
      }),
      prisma.subscriptionPlan.findUnique({ where: { id: requestedPlanId } }),
      prisma.subscriptionPlanChangeRequest.findFirst({
        where: { tenantId, status: "PENDING" },
      }),
    ]);

    if (!requestedPlan) {
      return NextResponse.json({ error: "Requested plan not found." }, { status: 404 });
    }

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a pending plan change request." },
        { status: 400 }
      );
    }

    if (currentSubscription?.planId === requestedPlanId) {
      return NextResponse.json(
        { error: "This plan is already active for your restaurant." },
        { status: 400 }
      );
    }

    const changeRequest = await prisma.subscriptionPlanChangeRequest.create({
      data: {
        tenantId,
        currentSubscriptionId: currentSubscription?.id || null,
        requestedPlanId,
        message: message || null,
      },
      include: {
        requestedPlan: true,
      },
    });

    return NextResponse.json({
      success: true,
      request: {
        id: changeRequest.id,
        status: changeRequest.status,
        requestedPlanName: changeRequest.requestedPlan?.name || "",
      },
    });
  } catch (error) {
    console.error("[subscription request create]", error);
    return NextResponse.json(
      { error: "Failed to submit plan change request." },
      { status: 500 }
    );
  }
}
