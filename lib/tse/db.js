/**
 * TSE database helpers: store signatures, queue for migration.
 * German fiscal compliance: orders, cancellations, payments, cashbook.
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
 * Queue a failed TSE transaction for retry by the daily cron.
 * Call when signAndStore* fails (e.g. Fiskaly timeout, offline).
 */
export async function queueForTSEMigration(tenantId, entityType, entityId, payload, options = {}) {
  try {
    await prisma.tSEQueue.create({
      data: {
        tenantId,
        entityType,
        entityId,
        payload,
        status: "PENDING",
      },
    });
    if (!options.silent) {
      console.warn("[TSE] Queued for migration:", entityType, entityId);
    }
  } catch (err) {
    // queue failed – swallow to avoid masking original TSE error
  }
}

/**
 * Sign and store a TSE transaction for an order.
 * On failure: queues for daily cron retry (TSE auto-migration).
 * @returns {Promise<{ signature: string, transactionId: string, signedAt: Date } | null>}
 */
export async function signAndStoreOrder(tenantId, orderId, orderNumber, grandTotal) {
  if (process.env.FISKALY_SKIP_WHEN_UNAVAILABLE !== "1") {
    console.log("[TSE] Signing order:", { orderId, orderNumber, grandTotal });
  }
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
        rawPayload: {
          orderNumber,
          grandTotal,
          qrCodeData: result.qrCodeData ?? null,
          tssSerialNumber: result.tssSerialNumber ?? null,
        },
      },
    });
    console.log("[TSE] Order signed OK:", { orderId, signature: result.signature?.slice(0, 20) + "…" });
    return {
      signature: result.signature,
      transactionId: result.transactionId,
      signedAt: new Date(result.timestamp),
    };
  } catch (err) {
    if (process.env.FISKALY_DEBUG === "1") {
      console.error("[TSE] Sign failed:", err?.message);
    }
    await queueForTSEMigration(tenantId, "ORDER", orderId, {
      type: "SALE",
      orderId,
      orderNumber,
      amount: grandTotal,
      fn: "Beleg",
      transactionType: TSE_TYPES.ORDER,
    }, { silent: err?.message === "TSE_SKIP_SOFT" });
    return null;
  }
}

/**
 * Sign and store a TSE transaction for order cancellation.
 * On failure: queues for daily cron retry.
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
    await queueForTSEMigration(tenantId, "CANCELLATION", orderId, {
      type: "CANCELLATION",
      orderId,
      orderNumber,
      fn: "Storno",
      transactionType: TSE_TYPES.CANCELLATION,
    });
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
    return null;
  }
}

/**
 * Sign and store a TSE transaction for cashbook entry (deposit/withdrawal).
 * On failure: queues for daily cron retry.
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
    await queueForTSEMigration(tenantId, type, cashbookEntryId, {
      type: type === "CASH_DEPOSIT" ? "DEPOSIT" : "WITHDRAWAL",
      cashbookEntryId,
      amount: Math.abs(Number(amount)),
      fn: type === "CASH_DEPOSIT" ? "Einlage" : "Entnahme",
      transactionType: type,
    });
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

/**
 * Get full TSE data for receipt (Fiskaly TSE block per KassenSichV).
 * Returns { signature, fiskalyTxId, signedAt } or null.
 */
export async function getOrderTseData(orderId) {
  const tx = await prisma.tSETransaction.findFirst({
    where: { orderId, transactionType: TSE_TYPES.ORDER },
    orderBy: { signedAt: "desc" },
  });
  if (!tx) return null;
  return {
    signature: tx.signature,
    fiskalyTxId: tx.fiskalyTxId,
    signedAt: tx.signedAt,
  };
}

/**
 * Check if order is queued for TSE migration (signing failed, will retry).
 */
export async function isOrderTseQueued(orderId) {
  const q = await prisma.tSEQueue.findFirst({
    where: { entityType: "ORDER", entityId: orderId, status: "PENDING" },
  });
  return !!q;
}
