/**
 * TSE (Technische Sicherheitseinrichtung) - German Fiscal Compliance.
 * Modular provider: mock (development) or fiskaly (production).
 * Switch via TSE_PROVIDER env var: "mock" | "fiskaly"
 */

import { mockSignTransaction } from "./mock.js";
import { fiskalySignTransaction } from "./fiskaly.js";

const PROVIDERS = { mock: "mock", fiskaly: "fiskaly" };
const DEFAULT_PROVIDER = "mock";

export function getTSEProvider() {
  const p = (process.env.TSE_PROVIDER || DEFAULT_PROVIDER).toLowerCase();
  return PROVIDERS[p] || DEFAULT_PROVIDER;
}

export function isMockMode() {
  return getTSEProvider() === "mock";
}

/**
 * Sign a fiscal transaction. Works with mock or Fiskaly based on TSE_PROVIDER.
 * @param {Object} payload - { type, orderNumber?, amount?, tenantId?, orderId?, fn? }
 * @returns {Promise<{ transactionId: string, signature: string, timestamp: string }>}
 */
export async function signTransaction(payload) {
  const provider = getTSEProvider();
  if (provider === "mock") {
    return mockSignTransaction(payload);
  }
  return fiskalySignTransaction(payload);
}
