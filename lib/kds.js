import { prisma } from "./db";

const KITCHEN_STATUSES = ["OPEN", "CONFIRMED", "PREPARING", "READY", "PACK"];

function toNum(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  return Number(v);
}

export async function getKDSOrders(tenantId, branchId = null) {
  if (!tenantId) return [];

  const where = {
    tenantId,
    ...(branchId && { branchId }),
    status: { in: KITCHEN_STATUSES },
  };

  const ordersRaw = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
      customer: true,
      table: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return ordersRaw.map((o) => ({
    ...o,
    subtotal: toNum(o.subtotal),
    taxAmount: toNum(o.taxAmount),
    discountAmount: toNum(o.discountAmount),
    tipAmount: toNum(o.tipAmount),
    grandTotal: toNum(o.grandTotal),
    orderItems: (o.orderItems || []).map((item) => ({
      ...item,
      unitPrice: toNum(item.unitPrice),
      taxRate: toNum(item.taxRate),
      totalAmount: toNum(item.totalAmount),
    })),
  }));
}
