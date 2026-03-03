import { prisma } from "./db";

/** Get next sequential order number (1, 2, 3, ...) for the tenant */
export async function getNextOrderNumber(tenantId, branchId = null) {
  const orders = await prisma.order.findMany({
    where: { tenantId, ...(branchId && { branchId }) },
    select: { orderNumber: true },
    orderBy: { id: "desc" },
    take: 500,
  });
  let maxNum = 0;
  for (const o of orders) {
    const num = parseInt(String(o.orderNumber).replace(/^\D+/, ""), 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }
  return maxNum + 1;
}

export async function getPOSData(tenantId, branchId) {
  if (!tenantId) return null;

  const [categories, products, addonGroups, tables, customers, nextOrderNumber] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { tenantId, isActive: true },
      include: { category: true, variants: true },
      orderBy: { name: "asc" },
    }),
    prisma.addonGroup.findMany({
      where: { tenantId },
      include: { addonItems: true },
      orderBy: { name: "asc" },
    }),
    prisma.diningTable.findMany({
      where: { tenantId, ...(branchId && { branchId }) },
      orderBy: { name: "asc" },
    }),
    prisma.customer.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
      take: 50,
    }),
    getNextOrderNumber(tenantId, branchId),
  ]);

  return {
    categories,
    products,
    addonGroups,
    tables,
    customers,
    nextOrderNumber,
  };
}
