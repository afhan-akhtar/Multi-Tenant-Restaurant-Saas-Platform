import { getTenantPrisma } from "@/lib/tenant-db";
import { getNextOrderNumber } from "@/lib/pos";
import { getKDSOrderById } from "@/lib/kds";
import { syncKdsItemsForOrder } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import { markDiningTableOccupied } from "@/lib/dining-table-availability";

function toNum(d) {
  return d ? Number(d) : 0;
}

/**
 * Shared dine-in order creation (used by POS and tablet).
 * Server trusts product IDs; prices come from line items (POS) or can be recomputed by caller.
 */
export async function createDineInOrder({
  tenantId,
  branchId,
  staffId,
  items,
  orderType = "DINE_IN",
  tableId = null,
  customerId = null,
  clientOrderNumber = null,
  lineItemStatus = "OPEN",
}) {
  if (!tenantId || !branchId || !staffId) {
    throw new Error("tenantId, branchId, and staffId are required");
  }
  if (!items?.length) {
    throw new Error("Order must have items");
  }

  const prisma = await getTenantPrisma(tenantId);

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
    throw new Error("Branch not found");
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
    throw new Error("Table and customer required");
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
      status: lineItemStatus,
    };
  });

  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  const resolvedOrderType = orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN";

  const order = await prisma.order.create({
    data: {
      tenantId,
      branchId,
      sessionId: session.id,
      tableId: table.id,
      customerId: customer.id,
      orderNumber,
      orderType: resolvedOrderType,
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

  if (resolvedOrderType === "DINE_IN") {
    await markDiningTableOccupied(tenantId, table.id);
  }

  await syncKdsItemsForOrder({
    tenantId,
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

  return { order, orderNumber, kdsOrder };
}
