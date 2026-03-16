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
 * @returns {Promise<{ signature: string, transactionId: string, signedAt: Date, tss_id?: string, tx_id?: string, signature_counter?: number, log_time_start?: string|null, log_time_end?: string|null, qrCodeData?: string|null } | null>}
 */
export async function signAndStoreOrder(tenantId, orderId, orderNumber, grandTotal) {
  if (process.env.FISKALY_SKIP_WHEN_UNAVAILABLE !== "1") {
    console.log("[TSE] Signing order:", { orderId, orderNumber, grandTotal });
  }
  try {
    // Load order items + payments so we can build DSFinV-K compatible
    // VAT buckets and payment parameters for processData.
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    // DSFinV-K tax buckets: 19%, 7%, 10.7%, 5.5%, 0%.
    const vatBuckets = [0, 0, 0, 0, 0];
    for (const it of order?.orderItems || []) {
      const rate = Number(it.taxRate) || 0;
      const net = Number(it.totalAmount) || 0;
      const gross = net * (1 + rate / 100);
      let idx = 4; // default 0%
      if (rate >= 18 && rate <= 20) idx = 0;
      else if (rate >= 6 && rate <= 8) idx = 1;
      else if (Math.abs(rate - 10.7) < 0.2) idx = 2;
      else if (Math.abs(rate - 5.5) < 0.2) idx = 3;
      vatBuckets[idx] += gross;
    }

    const payments = (order?.payments || []).map((p) => ({
      amount: Number(p.amount) || 0,
      type: p.method === "CASH" ? "BAR" : "UNBAR",
      currency: "EUR",
    }));

    const result = await signTransaction({
      type: "SALE",
      tenantId,
      orderId,
      orderNumber,
      amount: grandTotal,
      fn: "Beleg",
      vatBuckets,
      payments,
    });
    await prisma.tSETransaction.create({
      data: {
        orderId,
        transactionType: TSE_TYPES.ORDER,
        signature: result.signature || String(result.transactionId),
        fiskalyTxId: String(result.transactionId),
        signedAt: new Date(result.timestamp),
        rawPayload: {
          orderNumber,
          grandTotal,
          qrCodeData: result.qrCodeData ?? null,
          tssSerialNumber: result.tssSerialNumber ?? null,
          tssId: result.tssId ?? null,
          signatureCounter: result.signatureCounter ?? null,
          logTimeStart: result.logTimeStart ?? null,
          logTimeEnd: result.logTimeEnd ?? null,
        },
      },
    });
    console.log("[TSE] Order signed OK:", { orderId, signature: result.signature?.slice(0, 20) + "…" });
    return {
      signature: result.signature || String(result.transactionId),
      transactionId: String(result.transactionId),
      signedAt: new Date(result.timestamp),
      tss_id: result.tssId ?? null,
      tx_id: String(result.transactionId),
      signature_counter: result.signatureCounter ?? null,
      log_time_start: result.logTimeStart ?? null,
      log_time_end: result.logTimeEnd ?? null,
      qrCodeData: result.qrCodeData ?? null,
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
        signature: result.signature || String(result.transactionId),
        fiskalyTxId: String(result.transactionId),
        signedAt: new Date(result.timestamp),
        rawPayload: { orderNumber },
      },
    });
    return { signature: result.signature || String(result.transactionId), transactionId: result.transactionId };
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
        signature: result.signature || String(result.transactionId),
        fiskalyTxId: String(result.transactionId),
        signedAt: new Date(result.timestamp),
        rawPayload: { orderNumber, amount, method },
      },
    });
    return { signature: result.signature || String(result.transactionId), transactionId: result.transactionId };
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
        signature: result.signature || String(result.transactionId),
        fiskalyTxId: String(result.transactionId),
        signedAt: new Date(result.timestamp),
        rawPayload: { amount, type },
      },
    });
    return { signature: result.signature || String(result.transactionId), transactionId: result.transactionId };
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
    tss_id: tx.rawPayload?.tssId ?? null,
    signature_counter: tx.rawPayload?.signatureCounter ?? null,
    log_time_start: tx.rawPayload?.logTimeStart ?? null,
    log_time_end: tx.rawPayload?.logTimeEnd ?? null,
    qrCodeData: tx.rawPayload?.qrCodeData ?? null,
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
