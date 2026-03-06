"use client";

const ACCENT = "#14b8a6";

export function ReceiptPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-full px-4 py-2 rounded text-sm font-medium text-white hover:opacity-90"
      style={{ background: ACCENT }}
    >
      Save as PDF / Print
    </button>
  );
}
