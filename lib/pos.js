import { prisma } from "./db";

export async function getPOSData(tenantId, branchId) {
  if (!tenantId) return null;

  const [categories, products, addonGroups, tables, customers] = await Promise.all([
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
  ]);

  return {
    categories,
    products,
    addonGroups,
    tables,
    customers,
  };
}
