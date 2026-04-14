import { normalizePosHardwareSettings } from "./settings";

const DEFAULT_ATTEMPTS = 3;
const BASE_MS = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * POST JSON to the local POS Agent with retries (server-side forward).
 * @param {string} path - "/print" | "/drawer"
 * @param {object} body
 * @param {unknown} tenantSettingsRaw
 */
export async function forwardToPosAgent(path, body, tenantSettingsRaw) {
  const s = normalizePosHardwareSettings(tenantSettingsRaw);
  const base = s.agentBaseUrl;
  if (!base) {
    return { ok: false, agentReached: false, error: "POS agent URL not configured" };
  }

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (s.agentSecret) {
    headers["X-Pos-Agent-Secret"] = s.agentSecret;
  }

  let lastErr = "Unknown error";
  for (let attempt = 0; attempt < DEFAULT_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = { raw: text };
      }
      if (res.ok) {
        return { ok: true, agentReached: true, status: res.status, data: json };
      }
      lastErr = json?.error || json?.message || `HTTP ${res.status}`;
    } catch (e) {
      lastErr = e?.message || String(e);
    }
    if (attempt < DEFAULT_ATTEMPTS - 1) {
      await sleep(BASE_MS * 2 ** attempt);
    }
  }

  return { ok: false, agentReached: false, error: lastErr };
}
