import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import { signAndStoreCancellation } from "@/lib/tse/db";
import { refundOrderItems, RefundServiceError } from "@/lib/refunds/service";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posAccess = await assertTenantFeatureAccess(actor.tenantId, "POS");
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    const body = await request.json();
    const result = await refundOrderItems({
      tenantId: actor.tenantId,
      actor,
      orderId: body.orderId,
      itemIds: body.itemIds,
      reason: body.reason,
    });

    try {
      await signAndStoreCancellation(actor.tenantId, result.order.id, result.order.orderNumber, result.refundAmount, {
        tsePaymentBreakdown: result.tsePaymentBreakdown,
        refundedItemIds: result.refundedItemIds,
        batchKey: result.batchKey,
        reason: body.reason,
      });
    } catch (tseErr) {
      console.warn("[partial refund TSE storno]", tseErr?.message || tseErr);
    }

    if (result.refundedItemIds?.length) {
      await prisma.kDSItem.deleteMany({
        where: {
          orderItemId: { in: result.refundedItemIds },
        },
      });
    }

    broadcastTenantKdsEvent(actor.tenantId, "order.updated", {
      order: {
        id: result.order.id,
        branchId: result.order.branchId,
        status: result.order.status,
      },
    });

    return NextResponse.json({
      ...result,
      stornoReceiptUrl: `/receipt/${result.order.id}/storno`,
    });
  } catch (error) {
    if (error instanceof RefundServiceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }

    console.error("[partial refund error]", error);
    return NextResponse.json({ error: error.message || "Partial refund failed" }, { status: 500 });
  }
}
