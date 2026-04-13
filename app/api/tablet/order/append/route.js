import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getTabletWaiterFromRequest, assertWaiterStaff } from "@/lib/tablet-waiter";
import { syncKdsItemsForOrder } from "@/lib/kds-routing";
import { getKDSOrderById } from "@/lib/kds";
import { broadcastTenantKdsEvent } from "@/lib/realtime";

function toNum(d) {
  return d ? Number(d) : 0;
}

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
    const items = body?.items;
    if (!orderId || !items?.length) {
      return NextResponse.json({ error: "orderId and items required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId: actor.tenantId,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
      },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "COMPLETED" || order.status === "CANCELLED") {
      return NextResponse.json({ error: "Order cannot be modified" }, { status: 400 });
    }

    const productIds = [...new Set(items.map((item) => Number(item.productId)).filter(Boolean))];
    const products = await prisma.product.findMany({
      where: { tenantId: actor.tenantId, id: { in: productIds } },
      select: { id: true, kdsStation: true },
    });
    const productStationsByProductId = new Map(products.map((p) => [p.id, p.kdsStation || "MAIN"]));

    const createdItems = await prisma.$transaction(async (tx) => {
      const rows = [];
      for (const item of items) {
        const price = toNum(item.unitPrice) + (item.addonTotal || 0);
        const qty = item.quantity || 1;
        const total = price * qty;
        const oi = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            name: item.productName,
            unitPrice: price,
            price,
            taxRate: toNum(item.taxRate),
            quantity: qty,
            totalAmount: total,
            status: order.status,
          },
        });
        rows.push(oi);
      }

      const allItems = await tx.orderItem.findMany({
        where: { orderId: order.id },
      });

      let subtotal = 0;
      for (const line of allItems) {
        subtotal += Number(line.totalAmount);
      }
      const taxAmount = subtotal * 0.1;
      const grandTotal = subtotal + taxAmount;

      await tx.order.update({
        where: { id: order.id },
        data: {
          subtotal,
          taxAmount,
          totalAmount: grandTotal,
          grandTotal,
        },
      });

      return rows;
    });

    await syncKdsItemsForOrder({
      tenantId: actor.tenantId,
      orderId: order.id,
      branchId: order.branchId,
      orderStatus: order.status,
      orderItems: createdItems,
      productStationsByProductId,
    });

    const updated = await prisma.order.findFirst({
      where: { id: order.id },
      include: { orderItems: true },
    });

    const kdsOrder = await getKDSOrderById(actor.tenantId, order.id);
    if (kdsOrder) {
      broadcastTenantKdsEvent(actor.tenantId, "order.updated", { order: kdsOrder });
    }

    return NextResponse.json({ order: updated, kdsOrder });
  } catch (err) {
    console.error("[tablet order append]", err);
    return NextResponse.json({ error: err.message || "Failed to append items" }, { status: 500 });
  }
}
