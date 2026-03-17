import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { signAndStoreCancellation } from "@/lib/tse/db";
import { refundPosPaymentIntent } from "@/lib/payments/stripe";
import { NextResponse } from "next/server";

/**
 * Cancel an order.
 */
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

    return NextResponse.json({ ok: true, orderId: id });
  } catch (err) {
    console.error("[order cancel error]", err);
    return NextResponse.json({ error: err.message || "Cancel failed" }, { status: 500 });
  }
}
