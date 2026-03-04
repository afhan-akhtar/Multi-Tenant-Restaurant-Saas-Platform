import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { signCancellation } from "@/lib/fiskaly";
import { NextResponse } from "next/server";

/**
 * Cancel an order with TSE/Fiskaly signing (required for German fiscal compliance).
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
    const { orderId, reason } = body;
    const id = parseInt(orderId, 10);
    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id, tenantId },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (["CANCELLED", "REFUNDED"].includes(order.status)) {
      return NextResponse.json({ error: "Order already cancelled or refunded" }, { status: 400 });
    }

    let tseResult;
    try {
      tseResult = await signCancellation(id, reason || "Order cancelled");
    } catch (tseErr) {
      console.error("[cancel] TSE sign failed:", tseErr);
      return NextResponse.json(
        { error: "Fiscal signing failed. Cancellation must be signed via TSE." },
        { status: 500 }
      );
    }

    await prisma.tSETransaction.create({
      data: {
        orderId: id,
        signature: tseResult.signature,
        fiskalyTxId: tseResult.fiskalyTxId,
        signedAt: new Date(),
      },
    });

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
