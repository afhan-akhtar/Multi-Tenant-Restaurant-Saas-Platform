import { prisma } from "./db";

const KITCHEN_STATUSES = ["OPEN", "CONFIRMED", "PREPARING", "READY", "PACK"];

export async function getKDSOrders(tenantId, branchId = null) {
  if (!tenantId) return [];

  const where = {
    tenantId,
    ...(branchId && { branchId }),
    status: { in: KITCHEN_STATUSES },
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
      customer: true,
      table: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return orders;
}
