/**
 * Cashbook: Immutable recording of cash sales, deposits, and withdrawals (DS-FinV-K compliant).
 */

import { prisma } from "./db";

const ENTRY_TYPES = {
  CASH_SALE: "CASH_SALE",
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
};

export { ENTRY_TYPES };

export async function recordCashSale(tenantId, amount, orderId) {
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
  return prisma.cashbookEntry.create({
    data: {
      tenantId,
      type: ENTRY_TYPES.DEPOSIT,
      amount: Number(amount),
    },
  });
}

export async function recordWithdrawal(tenantId, amount) {
  return prisma.cashbookEntry.create({
    data: {
      tenantId,
      type: ENTRY_TYPES.WITHDRAWAL,
      amount: -Number(amount),
    },
  });
}
