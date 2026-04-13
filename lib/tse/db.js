/**
 * TSE database helpers: store signatures, queue for migration.
 * German fiscal compliance: orders, cancellations, payments, cashbook.
 */

import { getTenantPrisma } from "@/lib/tenant-db";
import { signTransaction } from "./index.js";

export const TSE_TYPES = {
  ORDER: "ORDER",
  CANCELLATION: "CANCELLATION",
  PAYMENT: "PAYMENT",
  CASH_DEPOSIT: "CASH_DEPOSIT",
  CASH_WITHDRAWAL: "CASH_WITHDRAWAL",
};

/** DSFinV-K tax buckets: 19%, 7%, 10.7%, 5.5%, 0% — gross per line. */
export function computeVatBucketsFromItems(items) {
  const vatBuckets = [0, 0, 0, 0, 0];
  for (const it of items || []) {
    const rate = Number(it.taxRate) || 0;
    const net = Number(it.totalAmount) || 0;
    const gross = net * (1 + rate / 100);
    let idx = 4;
    if (rate >= 18 && rate <= 20) idx = 0;
    else if (rate >= 6 && rate <= 8) idx = 1;
    else if (Math.abs(rate - 10.7) < 0.2) idx = 2;
    else if (Math.abs(rate - 5.5) < 0.2) idx = 3;
    vatBuckets[idx] += gross;
  }
  return vatBuckets;
}

function roundMoney2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function scaleVatBucketsToRefund(buckets, refundAmount) {
  const sum = buckets.reduce((a, b) => a + b, 0);
  const target = roundMoney2(refundAmount);
  if (sum <= 0.0001 || target <= 0) return buckets.map(() => 0);
  const factor = target / sum;
  const scaled = buckets.map((b) => roundMoney2(b * factor));
  const drift = roundMoney2(target - scaled.reduce((a, b) => a + b, 0));
  if (Math.abs(drift) >= 0.001) {
    const i = scaled.reduce((bestIdx, v, idx, arr) => (v > arr[bestIdx] ? idx : bestIdx), 0);
    scaled[i] = roundMoney2(scaled[i] + drift);
  }
  return scaled;
}

/**
 * Queue a failed TSE transaction for retry by the daily cron.
 * Call when signAndStore* fails (e.g. Fiskaly timeout, offline).
 */
export async function queueForTSEMigration(tenantId, entityType, entityId, payload, options = {}) {
  try {
    const prisma = await getTenantPrisma(tenantId);
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
    const prisma = await getTenantPrisma(tenantId);
    // Load order items + payments so we can build DSFinV-K compatible
    // VAT buckets and payment parameters for processData.
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    const vatBuckets = computeVatBucketsFromItems(order?.orderItems || []);

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
 * Sign and store a TSE refund transaction (same QR schema as sale: Kassenbeleg-V1 + Beleg, negative amounts).
 * Linked to the original sale in DB (originalFiskalyTxId); does not modify the original ORDER TSE row.
 * @param {number} refundAmount – positive EUR amount being refunded this operation.
 * @param {object} [options]
 * @param {{ amount: number, method: string }[]} [options.tsePaymentBreakdown] – per-payment refund split (from refund service).
 * @param {number[]} [options.refundedItemIds] – order item ids included in this refund (partial); omit for full-order shape.
 * @param {string} [options.batchKey]
 * @param {string} [options.reason]
 * @returns {Promise<object|null>}
 */
export async function signAndStoreCancellation(tenantId, orderId, orderNumber, refundAmount, options = {}) {
  const amt = roundMoney2(refundAmount);
  if (amt <= 0) {
    return { skipped: true, code: "ZERO_REFUND_AMOUNT" };
  }

  const {
    tsePaymentBreakdown = null,
    refundedItemIds = null,
    batchKey = null,
    reason = null,
    suppressQueue = false,
  } = options;

  try {
    const prisma = await getTenantPrisma(tenantId);
    const originalTx = await prisma.tSETransaction.findFirst({
      where: { orderId, transactionType: TSE_TYPES.ORDER },
      orderBy: { signedAt: "desc" },
    });
    if (!originalTx?.fiskalyTxId) {
      if (process.env.FISKALY_DEBUG === "1") {
        console.warn("[TSE] Storno skipped: no original ORDER TSE transaction for order", orderId);
      }
      return { skipped: true, code: "NO_ORIGINAL_ORDER_TSE" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true, payments: true },
    });
    if (!order) {
      return { skipped: true, code: "ORDER_NOT_FOUND" };
    }

    let itemsForBuckets = order.orderItems || [];
    if (Array.isArray(refundedItemIds) && refundedItemIds.length > 0) {
      const idSet = new Set(refundedItemIds.map((id) => Number(id)));
      itemsForBuckets = itemsForBuckets.filter((it) => idSet.has(it.id));
    }
    if (itemsForBuckets.length === 0) {
      itemsForBuckets = order.orderItems || [];
    }

    const bucketsPositive = scaleVatBucketsToRefund(computeVatBucketsFromItems(itemsForBuckets), amt);
    const vatBuckets = bucketsPositive.map((b) => roundMoney2(-b));

    let payments;
    if (Array.isArray(tsePaymentBreakdown) && tsePaymentBreakdown.length > 0) {
      payments = tsePaymentBreakdown.map((p) => ({
        amount: roundMoney2(-Math.abs(Number(p.amount) || 0)),
        type: String(p.method || "").toUpperCase() === "CASH" ? "BAR" : "UNBAR",
        currency: "EUR",
      }));
    } else {
      payments = [{ amount: roundMoney2(-amt), type: "BAR", currency: "EUR" }];
    }

    const result = await signTransaction({
      type: "CANCELLATION",
      tenantId,
      orderId,
      orderNumber,
      amount: roundMoney2(-amt),
      fn: "Beleg",
      vatBuckets,
      payments,
      originalFiskalyTxId: String(originalTx.fiskalyTxId),
    });

    await prisma.tSETransaction.create({
      data: {
        orderId,
        transactionType: TSE_TYPES.CANCELLATION,
        signature: result.signature || String(result.transactionId),
        fiskalyTxId: String(result.transactionId),
        signedAt: new Date(result.timestamp),
        rawPayload: {
          orderNumber,
          refundAmount: amt,
          originalFiskalyTxId: String(originalTx.fiskalyTxId),
          tsePaymentBreakdown: Array.isArray(tsePaymentBreakdown) ? tsePaymentBreakdown : null,
          batchKey,
          reason: reason ? String(reason).slice(0, 500) : null,
          qrCodeData: result.qrCodeData ?? null,
          tssSerialNumber: result.tssSerialNumber ?? null,
          tssId: result.tssId ?? null,
          signatureCounter: result.signatureCounter ?? null,
          logTimeStart: result.logTimeStart ?? null,
          logTimeEnd: result.logTimeEnd ?? null,
        },
      },
    });

    return {
      skipped: false,
      signature: result.signature || String(result.transactionId),
      transactionId: String(result.transactionId),
      signedAt: new Date(result.timestamp),
      tss_id: result.tssId ?? null,
      tx_id: String(result.transactionId),
      originalFiskalyTxId: String(originalTx.fiskalyTxId),
      qrCodeData: result.qrCodeData ?? null,
    };
  } catch (err) {
    if (process.env.FISKALY_DEBUG === "1") {
      console.error("[TSE] Storno sign failed:", err?.message);
    }
    if (!suppressQueue) {
      await queueForTSEMigration(tenantId, "CANCELLATION", orderId, {
        type: "CANCELLATION",
        orderId,
        orderNumber,
        amount: amt,
        fn: "Beleg",
        transactionType: TSE_TYPES.CANCELLATION,
        tsePaymentBreakdown,
        refundedItemIds,
        batchKey,
        reason,
      }, { silent: err?.message === "TSE_SKIP_SOFT" });
      return null;
    }
    throw err;
  }
}

/**
 * Sign and store a TSE transaction for a payment.
 */
export async function signAndStorePayment(tenantId, orderId, orderNumber, amount, method) {
  try {
    const prisma = await getTenantPrisma(tenantId);
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
    const prisma = await getTenantPrisma(tenantId);
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
export async function getOrderSignature(tenantId, orderId) {
  const prisma = await getTenantPrisma(tenantId);
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
export async function getOrderTseData(tenantId, orderId) {
  const prisma = await getTenantPrisma(tenantId);
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
export async function isOrderTseQueued(tenantId, orderId) {
  const prisma = await getTenantPrisma(tenantId);
  const q = await prisma.tSEQueue.findFirst({
    where: { entityType: "ORDER", entityId: orderId, status: "PENDING" },
  });
  return !!q;
}
