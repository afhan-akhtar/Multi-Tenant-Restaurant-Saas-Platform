import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { clearOrderKdsItems } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import { signAndStoreCancellation } from "@/lib/tse/db";
import { refundFullOrder, RefundServiceError } from "@/lib/refunds/service";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS", "KDS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posAccess = await assertTenantFeatureAccess(actor.tenantId, "POS");
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    const body = await request.json();
    const result = await refundFullOrder({
      tenantId: actor.tenantId,
      actor,
      orderId: body.orderId,
      reason: body.reason,
    });

    let warning = null;
    try {
      await signAndStoreCancellation(actor.tenantId, result.order.id, result.order.orderNumber);
      await clearOrderKdsItems(result.order.id);
    } catch (sideEffectError) {
      warning = sideEffectError.message || "Refund completed, but cancellation side effects need attention.";
      console.warn("[full refund post-processing warning]", sideEffectError);
    }

    broadcastTenantKdsEvent(actor.tenantId, "order.cancelled", {
      order: {
        id: result.order.id,
        branchId: result.order.branchId,
        status: result.order.status,
      },
    });

    return NextResponse.json({
      ...result,
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    if (error instanceof RefundServiceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }

    console.error("[full refund error]", error);
    return NextResponse.json({ error: error.message || "Full refund failed" }, { status: 500 });
  }
}
