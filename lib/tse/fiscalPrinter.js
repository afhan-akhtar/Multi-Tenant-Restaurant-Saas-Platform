/**
 * Fiscal printer hook for German TSE compliance.
 * Implement printer-specific logic here when hardware is required.
 * Receipt data is already TSE-signed; this layer handles physical printing.
 *
 * Usage:
 *   import { sendToFiscalPrinter } from "@/lib/tse/fiscalPrinter";
 *   await sendToFiscalPrinter(receiptData);
 */

/**
 * Send receipt to fiscal printer (if configured).
 * No-op when no printer; override or extend for hardware integration.
 * @param {Object} receipt - { orderNumber, items, payments, tseSignature, ... }
 * @returns {Promise<{ printed: boolean, error?: string }>}
 */
export async function sendToFiscalPrinter(receipt) {
  const enabled = process.env.FISCAL_PRINTER_ENABLED === "1" || process.env.FISCAL_PRINTER_ENABLED === "true";
  if (!enabled) {
    return { printed: false };
  }

  try {
    // TODO: Implement printer protocol (e.g. ESC/POS, driver API)
    // Receipt is already TSE-signed; printer just needs to output it
    console.log("[Fiscal printer] Would print:", receipt?.orderNumber);
    return { printed: false };
  } catch (err) {
    console.error("[Fiscal printer]", err);
    return { printed: false, error: err.message };
  }
}
