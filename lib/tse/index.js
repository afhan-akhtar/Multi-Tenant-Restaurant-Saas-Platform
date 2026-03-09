/**
 * TSE (Technische Sicherheitseinrichtung) - German Fiscal Compliance.
 * Integrates directly with Fiskaly API.
 * Requires: FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_TSS_ID
 */

import { fiskalySignTransaction } from "./fiskaly.js";

/**
 * Sign a fiscal transaction via Fiskaly TSE.
 * @param {Object} payload - { type, orderNumber?, amount?, tenantId?, orderId?, fn? }
 * @returns {Promise<{ transactionId: string, signature: string, timestamp: string }>}
 */
export async function signTransaction(payload) {
  return fiskalySignTransaction(payload);
}
