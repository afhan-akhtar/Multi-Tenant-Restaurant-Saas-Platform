/**
 * Minimal ESC/POS text builder for 58mm thermal printers (network or Bluetooth bridge).
 * Extend templates per tenant branding as needed.
 */
export function buildEscPosReceipt(receipt) {
  const lines = [];
  const w = 32;
  const center = (s) => {
    const t = String(s || "").slice(0, w);
    const pad = Math.max(0, Math.floor((w - t.length) / 2));
    return " ".repeat(pad) + t;
  };
  const row = (a, b) => {
    const left = String(a || "").slice(0, 18);
    const right = String(b || "").slice(0, 12);
    const gap = Math.max(1, w - left.length - right.length);
    return left + " ".repeat(gap) + right;
  };

  lines.push("\x1b\x40"); // init
  lines.push(center(receipt.tenantName || "Restaurant"));
  lines.push(center(receipt.orderNumber || ""));
  lines.push("-".repeat(w));
  for (const it of receipt.items || []) {
    lines.push(row(`${it.qty}x ${it.name}`, `€${Number(it.total || 0).toFixed(2)}`));
  }
  lines.push("-".repeat(w));
  lines.push(row("Total", `€${Number(receipt.grandTotal || 0).toFixed(2)}`));
  lines.push("");
  lines.push(center("Thank you"));
  lines.push("\n\n\n");
  lines.push("\x1d\x56\x00"); // partial cut (if supported)

  return lines.join("\n");
}
