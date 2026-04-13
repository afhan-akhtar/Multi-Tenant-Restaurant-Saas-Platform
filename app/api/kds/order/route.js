import { getTenantPrisma } from "@/lib/tenant-db";
import { signAndStoreOrder, getOrderSignature } from "@/lib/tse/db";
import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRequestActor } from "@/lib/device-auth";
import { getKDSOrderById } from "@/lib/kds";
import { syncOrderKdsItemStatus } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import { syncDiningTableAvailabilityForTable } from "@/lib/dining-table-availability";

const ALLOWED_STATUSES = ["CONFIRMED", "PREPARING", "READY", "PACK", "COMPLETED"];

export async function PATCH(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["KDS", "TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = actor.tenantId ?? null;
    if (!tenantId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantId);

    const featureCode = actor.deviceType === "TABLET" ? "TABLET" : "KDS";
    const featureAccess = await assertTenantFeatureAccess(tenantId, featureCode);
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
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

    if (status === "COMPLETED") {
      const existingSig = await getOrderSignature(tenantId, order.id);
      if (!existingSig) {
        await signAndStoreOrder(tenantId, order.id, order.orderNumber, Number(order.grandTotal));
      }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    await syncOrderKdsItemStatus(tenantId, orderId, status);

    if (status === "COMPLETED") {
      await syncDiningTableAvailabilityForTable(tenantId, order.tableId);
    }

    const updatedOrder = await getKDSOrderById(tenantId, orderId);
    if (updatedOrder) {
      broadcastTenantKdsEvent(tenantId, "order.updated", { order: updatedOrder });
    } else {
      broadcastTenantKdsEvent(tenantId, "order.updated", { order: { id: orderId, status } });
    }

    return NextResponse.json({ ok: true, order: updatedOrder ?? { id: orderId, status } });
  } catch (err) {
    console.error("[KDS order update error]", err);
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 });
  }
}
