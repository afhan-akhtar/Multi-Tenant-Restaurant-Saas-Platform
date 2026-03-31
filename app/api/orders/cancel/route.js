import { signAndStoreCancellation } from "@/lib/tse/db";
import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { clearOrderKdsItems } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import {
  cancelOrderFromKitchenDisplay,
  refundFullOrder,
  RefundServiceError,
} from "@/lib/refunds/service";

/**
 * Cancel an order.
 */
export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["KDS", "POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = actor.tenantId ?? null;
    if (!tenantId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const posAccess = await assertTenantFeatureAccess(tenantId, "POS");
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    const body = await request.json();
    const deviceLabel =
      actor.authMode === "device" && actor.deviceName
        ? String(actor.deviceName)
        : "";

    const isKdsDevice = actor.authMode === "device" && actor.deviceType === "KDS";

    const result = isKdsDevice
      ? await cancelOrderFromKitchenDisplay({
          tenantId,
          orderId: body.orderId,
          reason: body.reason,
          deviceLabel,
        })
      : await refundFullOrder({
          tenantId,
          actor,
          orderId: body.orderId,
          reason: body.reason || "Order cancelled from POS",
        });

    let warning = null;
    try {
      const orderIdForSideEffects = result.order?.id ?? result.orderId;
      const orderNumberForSideEffects = result.order?.orderNumber ?? result.orderNumber;
      const refundAmt = Number(result.refundAmount) || 0;
      if (refundAmt > 0.01 && orderIdForSideEffects && orderNumberForSideEffects) {
        await signAndStoreCancellation(tenantId, orderIdForSideEffects, orderNumberForSideEffects, refundAmt, {
          tsePaymentBreakdown: result.tsePaymentBreakdown,
          refundedItemIds: result.refundedItemIds,
          batchKey: result.batchKey,
          reason: body.reason,
        });
      }
      await clearOrderKdsItems(orderIdForSideEffects);
    } catch (sideEffectError) {
      warning = sideEffectError.message || "Refund completed, but cancellation post-processing needs attention.";
      console.warn("[order cancel warning]", sideEffectError);
    }

    const broadcastOrderId = result.order?.id ?? result.orderId;
    const broadcastBranchId = result.order?.branchId ?? null;

    broadcastTenantKdsEvent(tenantId, "order.cancelled", {
      order: { id: broadcastOrderId, branchId: broadcastBranchId, status: "CANCELLED" },
    });

    return NextResponse.json({
      ok: true,
      orderId: broadcastOrderId,
      refundAmount: result.refundAmount,
      mode: result.mode,
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    if (error instanceof RefundServiceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }

    console.error("[order cancel error]", error);
    return NextResponse.json({ error: error.message || "Cancel failed" }, { status: 500 });
  }
}
