import { prisma } from "@/lib/db";
import { signAndStoreCancellation } from "@/lib/tse/db";
import { refundPosPaymentIntent } from "@/lib/payments/stripe";
import { refundPayPalCapture } from "@/lib/payments/paypal";
import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { clearOrderKdsItems } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";

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

    const body = await request.json();
    const { orderId } = body;
    const id = parseInt(orderId, 10);
    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id, tenantId },
      include: { payments: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (["CANCELLED", "REFUNDED"].includes(order.status)) {
      return NextResponse.json({ error: "Order already cancelled or refunded" }, { status: 400 });
    }

    for (const payment of order.payments || []) {
      if (payment.method === "STRIPE" && payment.providerRef && payment.status !== "REFUNDED") {
        await refundPosPaymentIntent(payment.providerRef);
      }

      if (payment.method === "PAYPAL" && payment.providerRef && payment.status !== "REFUNDED") {
        await refundPayPalCapture(payment.providerRef);
      }
    }

    await signAndStoreCancellation(tenantId, id, order.orderNumber);

    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    await prisma.payment.updateMany({
      where: { orderId: id },
      data: { status: "REFUNDED" },
    });
    await clearOrderKdsItems(id);

    broadcastTenantKdsEvent(tenantId, "order.cancelled", {
      order: { id, status: "CANCELLED" },
    });

    return NextResponse.json({ ok: true, orderId: id });
  } catch (err) {
    console.error("[order cancel error]", err);
    return NextResponse.json({ error: err.message || "Cancel failed" }, { status: 500 });
  }
}
