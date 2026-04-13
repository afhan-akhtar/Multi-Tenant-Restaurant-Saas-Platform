import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { assignSubscriptionToTenant } from "@/lib/subscriptions";

export async function PATCH(request, { params }) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    const body = await request.json();
    const action = String(body?.action || "").trim().toLowerCase();
    const reviewedNote = String(body?.reviewedNote || "").trim();

    if (!["approve", "reject", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const changeRequest = await platformPrisma.subscriptionPlanChangeRequest.findUnique({
      where: { id },
      include: {
        tenant: true,
        requestedPlan: true,
      },
    });

    if (!changeRequest) {
      return NextResponse.json({ error: "Plan change request not found." }, { status: 404 });
    }

    if (changeRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending requests can be reviewed." },
        { status: 400 }
      );
    }

    const nextStatus =
      action === "approve" ? "APPROVED" : action === "reject" ? "REJECTED" : "CANCELLED";

    const result = await platformPrisma.$transaction(async (tx) => {
      let subscription = null;

      if (action === "approve") {
        subscription = await assignSubscriptionToTenant(tx, {
          tenantId: changeRequest.tenantId,
          planId: changeRequest.requestedPlanId,
        });
      }

      const updatedRequest = await tx.subscriptionPlanChangeRequest.update({
        where: { id: changeRequest.id },
        data: {
          status: nextStatus,
          reviewedNote: reviewedNote || null,
          reviewedAt: new Date(),
        },
      });

      return { updatedRequest, subscription };
    });

    return NextResponse.json({
      success: true,
      request: result.updatedRequest,
      subscription: result.subscription,
    });
  } catch (error) {
    console.error("[admin subscription request patch]", error);
    return NextResponse.json(
      { error: "Failed to update plan change request." },
      { status: 500 }
    );
  }
}
