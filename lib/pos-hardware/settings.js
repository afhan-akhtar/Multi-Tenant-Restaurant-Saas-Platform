/**
 * Normalizes Tenant.posHardwareSettings JSON for POS hardware integration.
 * Secrets are only used server-side (API routes); never expose agentSecret to the client.
 */

function trimUrl(url) {
  const s = String(url || "").trim();
  if (!s) return "";
  return s.replace(/\/+$/, "");
}

/**
 * @param {unknown} raw
 * @returns {{
 *   enabled: boolean,
 *   agentBaseUrl: string,
 *   agentSecret: string,
 *   localAgentBaseUrl: string,
 *   printer: { type: 'network' | 'usb_raw', host?: string, port?: number, devicePath?: string },
 *   drawer: { pin: number }
 * }}
 */
export function normalizePosHardwareSettings(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const printerIn = o.printer && typeof o.printer === "object" ? o.printer : {};
  const drawerIn = o.drawer && typeof o.drawer === "object" ? o.drawer : {};

  const type = String(printerIn.type || "network").toLowerCase() === "usb_raw" ? "usb_raw" : "network";
  const port = Math.min(65535, Math.max(1, Number(printerIn.port) || 9100));

  return {
    enabled: Boolean(
      o.enabled !== false &&
        (trimUrl(o.agentBaseUrl) ||
          trimUrl(o.localAgentBaseUrl) ||
          process.env.POS_AGENT_URL ||
          process.env.NEXT_PUBLIC_POS_AGENT_URL)
    ),
    agentBaseUrl: trimUrl(o.agentBaseUrl || process.env.POS_AGENT_URL || ""),
    agentSecret: String(o.agentSecret || process.env.POS_AGENT_SECRET || ""),
    localAgentBaseUrl: trimUrl(o.localAgentBaseUrl || process.env.NEXT_PUBLIC_POS_AGENT_URL || ""),
    printer: {
      type,
      host: String(printerIn.host || "").trim(),
      port,
      devicePath: String(printerIn.devicePath || "").trim(),
    },
    drawer: {
      pin: drawerIn.pin === 1 ? 1 : 0,
    },
  };
}

/**
 * Public fields safe to return to the browser (no secrets).
 */
export function publicPosHardwareSettings(raw) {
  const n = normalizePosHardwareSettings(raw);
  return {
    enabled: n.enabled,
    localAgentBaseUrl: n.localAgentBaseUrl || "http://127.0.0.1:3910",
  };
}
