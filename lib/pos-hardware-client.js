/**
 * Browser-side helpers: call Next.js POS hardware routes, then bridge to the local POS Agent if needed.
 */

import { getDeviceHeaders } from "@/lib/device-client";

async function tryLocalAgentBridge(clientBridge) {
  if (!clientBridge?.url) return { ok: false, skipped: true };
  try {
    const res = await fetch(clientBridge.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(clientBridge.body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}

/**
 * @param {object} receipt - same shape as checkout `receipt`
 * @param {number} tenantId
 * @param {object|null} deviceAuth
 */
export async function requestThermalPrint(receipt, tenantId, deviceAuth = null) {
  const res = await fetch("/api/print-receipt", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getDeviceHeaders(deviceAuth),
    },
    body: JSON.stringify({ tenant_id: tenantId, receipt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, error: data.error || `HTTP ${res.status}` };
  }
  if (!data.success && data.clientBridge) {
    const local = await tryLocalAgentBridge(data.clientBridge);
    return {
      success: local.ok,
      agentReached: local.ok,
      bridgedLocally: true,
      error: local.ok ? null : local.error || data.error,
    };
  }
  return {
    success: Boolean(data.success),
    agentReached: Boolean(data.agentReached),
    bridgedLocally: false,
    error: data.error || null,
  };
}

/**
 * @param {number} tenantId
 * @param {object|null} deviceAuth
 */
export async function requestOpenDrawer(tenantId, deviceAuth = null) {
  const res = await fetch("/api/open-drawer", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getDeviceHeaders(deviceAuth),
    },
    body: JSON.stringify({ tenant_id: tenantId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, error: data.error || `HTTP ${res.status}` };
  }
  if (!data.success && data.clientBridge) {
    const local = await tryLocalAgentBridge(data.clientBridge);
    return {
      success: local.ok,
      agentReached: local.ok,
      bridgedLocally: true,
      error: local.ok ? null : local.error || data.error,
    };
  }
  return {
    success: Boolean(data.success),
    agentReached: Boolean(data.agentReached),
    bridgedLocally: false,
    error: data.error || null,
  };
}

/**
 * After successful cash payment: thermal print then open drawer (best-effort; does not throw).
 * @param {object} result - checkout API response
 * @param {{ tenantId: number, deviceAuth?: object|null }} ctx
 */
export async function runCashPaymentHardware(result, ctx) {
  const { tenantId, deviceAuth = null } = ctx || {};
  if (!tenantId || !result?.receipt) return;

  const payments = result.receipt.payments;
  const hasCash =
    Array.isArray(payments) &&
    payments.some((p) => String(p.method).toUpperCase() === "CASH" && Number(p.amount) > 0);
  if (!hasCash) return;

  try {
    const print = await requestThermalPrint(result.receipt, tenantId, deviceAuth);
    if (!print.success) {
      console.warn("[pos-hardware] print:", print.error || "failed");
    }
  } catch (e) {
    console.warn("[pos-hardware] print exception", e);
  }

  try {
    const dr = await requestOpenDrawer(tenantId, deviceAuth);
    if (!dr.success) {
      console.warn("[pos-hardware] drawer:", dr.error || "failed");
    }
  } catch (e) {
    console.warn("[pos-hardware] drawer exception", e);
  }
}
