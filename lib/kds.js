import { prisma } from "./db";
import { createReceiptAccessToken } from "./receipt-access";

const KITCHEN_STATUSES = ["OPEN", "CONFIRMED", "PREPARING", "READY", "PACK"];

function toNum(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  return Number(v);
}

export function serializeKDSOrder(order) {
  return {
    ...order,
    receiptAccessToken: createReceiptAccessToken({
      orderId: order.id,
      tenantId: order.tenantId,
    }),
    subtotal: toNum(order.subtotal),
    taxAmount: toNum(order.taxAmount),
    discountAmount: toNum(order.discountAmount),
    tipAmount: toNum(order.tipAmount),
    grandTotal: toNum(order.grandTotal),
    orderItems: (order.orderItems || []).map((item) => ({
      ...item,
      unitPrice: toNum(item.unitPrice),
      taxRate: toNum(item.taxRate),
      totalAmount: toNum(item.totalAmount),
    })),
  };
}

const KDS_ORDER_INCLUDE = {
  orderItems: true,
  customer: true,
  table: true,
};

export async function getKDSOrders(tenantId, branchId = null) {
  if (!tenantId) return [];

  const where = {
    tenantId,
    ...(branchId && { branchId }),
    status: { in: KITCHEN_STATUSES },
  };

  const ordersRaw = await prisma.order.findMany({
    where,
    include: KDS_ORDER_INCLUDE,
    orderBy: { createdAt: "asc" },
  });

  return ordersRaw.map(serializeKDSOrder);
}

export async function getKDSOrderById(tenantId, orderId) {
  if (!tenantId || !orderId) return null;

  const order = await prisma.order.findFirst({
    where: { id: orderId, tenantId },
    include: KDS_ORDER_INCLUDE,
  });

  return order ? serializeKDSOrder(order) : null;
}
