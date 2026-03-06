/**
 * TSE database helpers: store signatures, queue for migration.
 */

import { prisma } from "@/lib/db";
import { signTransaction } from "./index.js";

export const TSE_TYPES = {
  ORDER: "ORDER",
  CANCELLATION: "CANCELLATION",
  PAYMENT: "PAYMENT",
  CASH_DEPOSIT: "CASH_DEPOSIT",
  CASH_WITHDRAWAL: "CASH_WITHDRAWAL",
};

/**
 * Sign and store a TSE transaction for an order.
 * @returns {Promise<{ signature: string, transactionId: string, signedAt: Date } | null>}
 */
export async function signAndStoreOrder(tenantId, orderId, orderNumber, grandTotal) {
  try {
    const result = await signTransaction({
      type: "SALE",
      tenantId,
      orderId,
      orderNumber,
      amount: grandTotal,
      fn: "Beleg",
    });
    await prisma.tSETransaction.create({
      data: {
        orderId,
        transactionType: TSE_TYPES.ORDER,
        signature: result.signature,
        fiskalyTxId: result.transactionId,
        signedAt: new Date(result.timestamp),
        rawPayload: { orderNumber, grandTotal },
      },
    });
    return {
      signature: result.signature,
      transactionId: result.transactionId,
      signedAt: new Date(result.timestamp),
    };
  } catch (err) {
    console.error("[TSE sign order]", err);
    return null;
  }
}

/**
 * Sign and store a TSE transaction for order cancellation.
 */
export async function signAndStoreCancellation(tenantId, orderId, orderNumber) {
  try {
    const result = await signTransaction({
      type: "CANCELLATION",
      tenantId,
      orderId,
      orderNumber,
      fn: "Storno",
    });
    await prisma.tSETransaction.create({
      data: {
        orderId,
        transactionType: TSE_TYPES.CANCELLATION,
        signature: result.signature,
        fiskalyTxId: result.transactionId,
        signedAt: new Date(result.timestamp),
        rawPayload: { orderNumber },
      },
    });
    return { signature: result.signature, transactionId: result.transactionId };
  } catch (err) {
    console.error("[TSE sign cancellation]", err);
    return null;
  }
}

/**
 * Sign and store a TSE transaction for a payment.
 */
export async function signAndStorePayment(tenantId, orderId, orderNumber, amount, method) {
  try {
    const result = await signTransaction({
      type: "PAYMENT",
      tenantId,
      orderId,
      orderNumber,
      amount,
      fn: `Zahlung-${method}`,
    });
    await prisma.tSETransaction.create({
      data: {
        orderId,
        transactionType: TSE_TYPES.PAYMENT,
        signature: result.signature,
        fiskalyTxId: result.transactionId,
        signedAt: new Date(result.timestamp),
        rawPayload: { orderNumber, amount, method },
      },
    });
    return { signature: result.signature, transactionId: result.transactionId };
  } catch (err) {
    console.error("[TSE sign payment]", err);
    return null;
  }
}

/**
 * Sign and store a TSE transaction for cashbook entry (deposit/withdrawal).
 */
export async function signAndStoreCashbook(tenantId, cashbookEntryId, type, amount) {
  try {
    const result = await signTransaction({
      type: type === "CASH_DEPOSIT" ? "DEPOSIT" : "WITHDRAWAL",
      tenantId,
      amount: Math.abs(Number(amount)),
      fn: type === "CASH_DEPOSIT" ? "Einlage" : "Entnahme",
    });
    await prisma.tSETransaction.create({
      data: {
        cashbookEntryId,
        transactionType: type,
        signature: result.signature,
        fiskalyTxId: result.transactionId,
        signedAt: new Date(result.timestamp),
        rawPayload: { amount, type },
      },
    });
    return { signature: result.signature, transactionId: result.transactionId };
  } catch (err) {
    console.error("[TSE sign cashbook]", err);
    return null;
  }
}

/**
 * Get latest TSE signature for an order (for receipt).
 */
export async function getOrderSignature(orderId) {
  const tx = await prisma.tSETransaction.findFirst({
    where: { orderId, transactionType: TSE_TYPES.ORDER },
    orderBy: { signedAt: "desc" },
  });
  return tx?.signature ?? null;
}
