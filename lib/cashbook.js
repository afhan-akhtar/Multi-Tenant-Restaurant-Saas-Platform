/**
 * Cashbook: Immutable recording of cash sales, deposits, and withdrawals (DS-FinV-K compliant).
 */

import { getTenantPrisma } from "./tenant-db";

const ENTRY_TYPES = {
  CASH_SALE: "CASH_SALE",
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
};

export { ENTRY_TYPES };

export async function recordCashSale(tenantId, amount, orderId) {
  const prisma = await getTenantPrisma(tenantId);
  return prisma.cashbookEntry.create({
    data: {
      tenantId,
      type: ENTRY_TYPES.CASH_SALE,
      amount: Number(amount),
      referenceId: orderId,
    },
  });
}

export async function recordDeposit(tenantId, amount) {
  const prisma = await getTenantPrisma(tenantId);
  return prisma.cashbookEntry.create({
    data: {
      tenantId,
      type: ENTRY_TYPES.DEPOSIT,
      amount: Number(amount),
    },
  });
}

export async function recordWithdrawal(tenantId, amount) {
  const prisma = await getTenantPrisma(tenantId);
  return prisma.cashbookEntry.create({
    data: {
      tenantId,
      type: ENTRY_TYPES.WITHDRAWAL,
      amount: -Number(amount),
    },
  });
}
