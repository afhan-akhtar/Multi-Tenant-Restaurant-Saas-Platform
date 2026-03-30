import { prisma } from "@/lib/db";
import { getNextOrderNumber } from "@/lib/pos";
import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRequestActor } from "@/lib/device-auth";
import { getKDSOrderById } from "@/lib/kds";
import { syncKdsItemsForOrder } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";

function toNum(d) {
  return d ? Number(d) : 0;
}

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, orderType, tableId, customerId, orderNumber: clientOrderNumber } = await request.json();
    const tenantId = actor.tenantId ?? null;
    const branchId = actor.branchId ?? null;
    const staffId = actor.staffId ?? null;

    if (!tenantId || !branchId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    if (!staffId) {
      return NextResponse.json({ error: "No active staff member is linked to this POS device." }, { status: 400 });
    }

    const featureAccess = await assertTenantFeatureAccess(tenantId, "POS");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Order must have items" }, { status: 400 });
    }

    const productIds = [...new Set(items.map((item) => Number(item.productId)).filter(Boolean))];
    const products = productIds.length
      ? await prisma.product.findMany({
          where: {
            tenantId,
            id: { in: productIds },
          },
          select: {
            id: true,
            kdsStation: true,
          },
        })
      : [];
    const productStationsByProductId = new Map(products.map((product) => [product.id, product.kdsStation || "MAIN"]));

    const branch = await prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    let table = await prisma.diningTable.findFirst({
      where: { tenantId, ...(tableId && { id: tableId }) },
    });
    if (!table) {
      table = await prisma.diningTable.findFirst({
        where: { tenantId, branchId },
      });
    }

    let customer = await prisma.customer.findFirst({
      where: { id: customerId, tenantId },
    });
    if (!customer) {
      customer = await prisma.customer.findFirst({
        where: { tenantId },
      });
    }

    if (!table || !customer) {
      return NextResponse.json({ error: "Table and customer required. Run db seed." }, { status: 400 });
    }

    const now = new Date();
    const orderNumber = clientOrderNumber
      ? String(clientOrderNumber)
      : `ORD${await getNextOrderNumber(tenantId, branchId)}`;

    const session = await prisma.session.create({
      data: {
        tenantId,
        branchId,
        tableId: table.id,
        waiterId: staffId,
        openedAt: now,
      },
    });

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const price = toNum(item.unitPrice) + (item.addonTotal || 0);
      const qty = item.quantity || 1;
      const total = price * qty;
      subtotal += total;
      return {
        productId: item.productId,
        productName: item.productName,
        name: item.productName,
        unitPrice: price,
        price,
        taxRate: toNum(item.taxRate),
        quantity: qty,
        totalAmount: total,
        status: "OPEN",
      };
    });

    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    const order = await prisma.order.create({
      data: {
        tenantId,
        branchId,
        sessionId: session.id,
        tableId: table.id,
        customerId: customer.id,
        orderNumber,
        orderType: orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN",
        status: "OPEN",
        subtotal,
        taxAmount,
        discountAmount: 0,
        tipAmount: 0,
        totalAmount: grandTotal,
        grandTotal,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    await syncKdsItemsForOrder({
      orderId: order.id,
      branchId,
      orderStatus: order.status,
      orderItems: order.orderItems,
      productStationsByProductId,
    });

    const kdsOrder = await getKDSOrderById(tenantId, order.id);
    if (kdsOrder) {
      broadcastTenantKdsEvent(tenantId, "order.created", { order: kdsOrder });
    }

    return NextResponse.json({ order, orderNumber, kdsOrder });
  } catch (err) {
    console.error("[POS order error]", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}
