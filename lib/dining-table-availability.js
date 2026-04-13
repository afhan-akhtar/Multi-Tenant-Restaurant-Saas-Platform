import { getTenantPrisma } from "@/lib/tenant-db";

/** Matches tablet serve: orders in these states no longer reserve the table. */
const NON_OCCUPYING_ORDER_STATUSES = ["COMPLETED", "CANCELLED", "REFUNDED"];

/**
 * Mark a table occupied when a dine-in order is placed (POS, tablet, or checkout).
 */
export async function markDiningTableOccupied(tenantId, tableId) {
  if (!tenantId || !tableId) return;
  const prisma = await getTenantPrisma(tenantId);
  await prisma.diningTable.updateMany({
    where: { id: tableId, tenantId },
    data: { status: "OCCUPIED" },
  });
}

/**
 * Set dining table to AVAILABLE when no non-terminal orders remain on that table.
 */
export async function syncDiningTableAvailabilityForTable(tenantId, tableId) {
  if (!tenantId || !tableId) return;

  const prisma = await getTenantPrisma(tenantId);
  const openOnTable = await prisma.order.count({
    where: {
      tenantId,
      tableId,
      status: { notIn: NON_OCCUPYING_ORDER_STATUSES },
    },
  });

  if (openOnTable === 0) {
    await prisma.diningTable.updateMany({
      where: { id: tableId, tenantId },
      data: { status: "AVAILABLE" },
    });
  }
}
