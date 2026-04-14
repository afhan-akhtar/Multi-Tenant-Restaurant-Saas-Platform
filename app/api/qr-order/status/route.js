import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";

export const dynamic = "force-dynamic";

/** Map internal order status to a simple customer-facing label */
function mapGuestStatus(status) {
  switch (status) {
    case "OPEN":
    case "CONFIRMED":
      return { label: "Pending", phase: "pending" };
    case "PREPARING":
    case "PACK":
      return { label: "Preparing", phase: "preparing" };
    case "READY":
      return { label: "Ready", phase: "ready" };
    case "COMPLETED":
      return { label: "Completed", phase: "completed" };
    case "CANCELLED":
    case "REFUNDED":
    case "PARTIAL_REFUND":
      return { label: "Closed", phase: "closed" };
    default:
      return { label: "Pending", phase: "pending" };
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenant_id") ? Number(searchParams.get("tenant_id")) : null;
    const token = searchParams.get("token")?.trim();

    if (!tenantId || !token) {
      return NextResponse.json({ error: "tenant_id and token are required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantId);
    const order = await prisma.order.findFirst({
      where: { tenantId, qrClientToken: token },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        grandTotal: true,
        createdAt: true,
        table: { select: { id: true, name: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const mapped = mapGuestStatus(order.status);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      guestStatus: mapped.label,
      guestPhase: mapped.phase,
      tableName: order.table?.name ?? "",
      grandTotal: Number(order.grandTotal),
      updatedAt: order.createdAt,
    });
  } catch (err) {
    console.error("[qr-order status]", err);
    return NextResponse.json({ error: "Failed to load status" }, { status: 500 });
  }
}
