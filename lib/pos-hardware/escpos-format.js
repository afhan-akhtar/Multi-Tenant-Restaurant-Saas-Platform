/**
 * ESC/POS receipt builder — structured JSON (same shape as POS checkout `receipt`) → Buffer.
 * Uses a conservative ASCII subset for wide printer compatibility.
 */

const ESC = 0x1b;
const GS = 0x1d;

function asciiLine(s, maxLen = 48) {
  const t = String(s ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?");
  return t.length > maxLen ? `${t.slice(0, maxLen - 1)}…` : t;
}

function money(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "0.00";
  return x.toFixed(2);
}

/** Initialize + basic text mode */
function init() {
  return Buffer.from([ESC, 0x40]); // ESC @
}

function align(n) {
  // 0 left, 1 center, 2 right
  return Buffer.from([ESC, 0x61, n & 3]);
}

function bold(on) {
  return Buffer.from([ESC, 0x45, on ? 1 : 0]);
}

function feed(n = 3) {
  return Buffer.from([ESC, 0x64, Math.min(255, Math.max(0, n))]); // ESC d
}

function cut() {
  return Buffer.from([GS, 0x56, 0x00]); // GS V 0 full cut
}

/**
 * Cash drawer kick (ESC p). Most drawers are wired to pin 2 (m=0) or pin 5 (m=1).
 * @param {number} pin 0 | 1
 */
export function escposCashDrawerPulse(pin = 0) {
  const m = pin === 1 ? 1 : 0;
  return Buffer.from([ESC, 0x70, m, 0x19, 0xfa]);
}

/**
 * @param {Record<string, unknown>} receipt
 * @returns {Buffer}
 */
export function formatReceiptEscPos(receipt) {
  if (!receipt || typeof receipt !== "object") {
    return Buffer.concat([init(), Buffer.from("No receipt data\n", "ascii"), feed(4), cut()]);
  }

  const chunks = [init(), align(1), bold(1)];

  const title = asciiLine(receipt.tenantName || "Restaurant");
  chunks.push(Buffer.from(`${title}\n`, "ascii"));
  chunks.push(bold(0));

  const branch = asciiLine(receipt.branchName || "");
  if (branch) chunks.push(Buffer.from(`${branch}\n`, "ascii"));

  const addr = asciiLine(String(receipt.branchAddress || "").replace(/\s+/g, " "));
  if (addr) chunks.push(Buffer.from(`${addr}\n`, "ascii"));

  chunks.push(Buffer.from("--------------------------------\n", "ascii"));
  chunks.push(align(0));

  const orderNo = receipt.orderNumber ?? receipt.orderNo ?? receipt.receiptNumber ?? "—";
  chunks.push(Buffer.from(`Order: ${asciiLine(String(orderNo), 36)}\n`, "ascii"));

  const when = receipt.date ? new Date(receipt.date).toISOString() : new Date().toISOString();
  chunks.push(Buffer.from(`${asciiLine(when, 44)}\n`, "ascii"));
  chunks.push(Buffer.from("--------------------------------\n", "ascii"));

  const items = Array.isArray(receipt.items) ? receipt.items : [];
  for (const it of items) {
    const name = asciiLine(it.name || "Item", 28);
    const qty = Number(it.qty ?? it.quantity) || 0;
    const lineTotal = money(it.total ?? (Number(it.unitPrice) || 0) * qty);
    const left = `${name}`;
    const right = `${qty} x ${money(it.unitPrice)}  ${lineTotal}`;
    chunks.push(Buffer.from(`${left}\n`, "ascii"));
    chunks.push(Buffer.from(`  ${asciiLine(right, 44)}\n`, "ascii"));
  }

  chunks.push(Buffer.from("--------------------------------\n", "ascii"));

  const sub = money(receipt.subtotal);
  const tax = money(receipt.taxAmount);
  const disc = money(receipt.discountAmount);
  const grand = money(receipt.grandTotal);

  chunks.push(Buffer.from(`Subtotal: ${sub}\n`, "ascii"));
  chunks.push(Buffer.from(`Tax:      ${tax}\n`, "ascii"));
  if (Number(receipt.discountAmount) > 0) {
    chunks.push(Buffer.from(`Discount: ${disc}\n`, "ascii"));
  }
  chunks.push(bold(1));
  chunks.push(Buffer.from(`TOTAL:    ${grand} EUR\n`, "ascii"));
  chunks.push(bold(0));

  const payments = Array.isArray(receipt.payments) ? receipt.payments : [];
  if (payments.length) {
    chunks.push(Buffer.from("--------------------------------\n", "ascii"));
    for (const p of payments) {
      const method = asciiLine(String(p.method || ""), 12);
      chunks.push(Buffer.from(`${method}: ${money(p.amount)}\n`, "ascii"));
    }
  }

  if (receipt.cashReceived != null) {
    chunks.push(Buffer.from(`Tendered: ${money(receipt.cashReceived)}\n`, "ascii"));
    chunks.push(Buffer.from(`Change:   ${money(receipt.changeGiven)}\n`, "ascii"));
  }

  if (receipt.tseQueued) {
    chunks.push(Buffer.from("\nTSE signing pending\n", "ascii"));
  } else if (receipt.signature || receipt.tseSignature) {
    const sig = asciiLine(String(receipt.signature || receipt.tseSignature || ""), 42);
    chunks.push(Buffer.from(`\nSig: ${sig}\n`, "ascii"));
  }

  const qr = receipt.tseQrData || receipt.qrCodeData;
  if (qr) {
    chunks.push(Buffer.from(`\n${asciiLine(String(qr), 42)}\n`, "ascii"));
  }

  chunks.push(feed(4));
  chunks.push(cut());

  return Buffer.concat(chunks);
}
