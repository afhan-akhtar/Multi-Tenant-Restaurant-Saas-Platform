import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const ALLOWED_STATUSES = ["CONFIRMED", "PREPARING", "READY", "COMPLETED"];

export async function PATCH(request) {
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

    const { searchParams } = new URL(request.url);
    const orderId = parseInt(searchParams.get("id"), 10);
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, tenantId },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[KDS order update error]", err);
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 });
  }
}
