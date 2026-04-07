import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getTabletWaiterFromRequest, assertWaiterStaff } from "@/lib/tablet-waiter";
import { syncOrderKdsItemStatus } from "@/lib/kds-routing";
import { getKDSOrderById } from "@/lib/kds";
import { broadcastTenantKdsEvent } from "@/lib/realtime";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const waiter = await getTabletWaiterFromRequest(request);
    if (!waiter || waiter.tenantId !== actor.tenantId) {
      return NextResponse.json({ error: "Waiter session required" }, { status: 403 });
    }

    const staff = await assertWaiterStaff(actor.tenantId, actor.branchId, waiter.staffId);
    if (!staff) {
      return NextResponse.json({ error: "Invalid waiter" }, { status: 403 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const body = await request.json();
    const orderId = Number(body?.orderId);
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId: actor.tenantId,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    await prisma.orderItem.updateMany({
      where: { orderId },
      data: { status: "COMPLETED" },
    });

    await syncOrderKdsItemStatus(orderId, "COMPLETED");

    const otherOpen = await prisma.order.count({
      where: {
        tenantId: actor.tenantId,
        tableId: order.tableId,
        id: { not: orderId },
        status: { notIn: ["COMPLETED", "CANCELLED", "REFUNDED"] },
      },
    });

    if (otherOpen === 0) {
      await prisma.diningTable.updateMany({
        where: {
          id: order.tableId,
          tenantId: actor.tenantId,
        },
        data: { status: "AVAILABLE" },
      });
    }

    const kdsOrder = await getKDSOrderById(actor.tenantId, orderId);
    if (kdsOrder) {
      broadcastTenantKdsEvent(actor.tenantId, "order.completed", { order: kdsOrder });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("[tablet order serve]", err);
    return NextResponse.json({ error: err.message || "Failed to complete order" }, { status: 500 });
  }
}
