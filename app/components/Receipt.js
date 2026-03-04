"use client";

/**
 * Printable receipt for POS orders.
 * Use ref + Receipt.print() or Receipt.printReceipt(receiptData) for programmatic print.
 */
import { useRef, useEffect } from "react";

const STYLE = `
  @media print {
    body * { visibility: hidden; }
    #receipt-print-area, #receipt-print-area * { visibility: visible; }
    #receipt-print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 80mm;
      max-width: 300px;
      padding: 8px;
      font-family: monospace;
      font-size: 12px;
      background: white;
      color: black;
    }
  }
`;

export function Receipt({ receipt, onPrinted }) {
  const printRef = useRef(null);

  useEffect(() => {
    if (!receipt || !printRef.current) return;
    const el = printRef.current;
    const beforePrint = () => {
      el.style.display = "block";
    };
    const afterPrint = () => {
      el.style.display = "none";
      onPrinted?.();
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [receipt, onPrinted]);

  if (!receipt) return null;

  const { tenantName, branchName, orderNumber, date, items, subtotal, taxAmount, discountAmount, grandTotal, payments, tseSignature } = receipt;

  return (
    <>
      <style>{STYLE}</style>
      <div
        id="receipt-print-area"
        ref={printRef}
        className="hidden print:block bg-white text-black p-4 font-mono text-xs max-w-[300px]"
        style={{ width: "80mm" }}
      >
        <div className="text-center border-b border-black pb-2 mb-2">
          <div className="font-bold text-sm">{tenantName}</div>
          <div className="text-[10px]">{branchName}</div>
        </div>
        <div className="text-[10px] text-gray-600 mb-2">
          Order: {orderNumber} | {new Date(date).toLocaleString()}
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-1 pr-2">Item</th>
              <th className="py-1 text-right">Qty</th>
              <th className="py-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((it, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-1 pr-2">{it.name}</td>
                <td className="py-1 text-right">{it.qty}</td>
                <td className="py-1 text-right">€{(it.total || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 pt-2 border-t border-black space-y-0.5 text-right">
          <div>Subtotal: €{(subtotal || 0).toFixed(2)}</div>
          <div>Tax: €{(taxAmount || 0).toFixed(2)}</div>
          {discountAmount > 0 && <div>Discount: -€{(discountAmount || 0).toFixed(2)}</div>}
          <div className="font-bold">Total: €{(grandTotal || 0).toFixed(2)}</div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-300 text-[10px]">
          {payments?.map((p, i) => (
            <div key={i}>
              {p.method}: €{(p.amount || 0).toFixed(2)}
            </div>
          ))}
        </div>
        {tseSignature && (
          <div className="mt-2 pt-2 border-t border-gray-300 text-[9px] break-all">
            TSE: {String(tseSignature).slice(0, 24)}…
          </div>
        )}
        <div className="mt-4 text-center text-[10px]">
          Thank you!
        </div>
      </div>
    </>
  );
}

export function printReceipt(receipt) {
  if (!receipt) return;
  const w = window.open("", "_blank", "width=320,height=480");
  if (!w) return;
  const { tenantName, branchName, orderNumber, date, items, subtotal, taxAmount, discountAmount, grandTotal, payments, tseSignature } = receipt;
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head><title>Receipt ${orderNumber}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: monospace; font-size: 12px; padding: 12px; }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .mb { margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 2px 4px; }
      .r { text-align: right; }
    </style>
    </head>
    <body>
      <div class="center mb bold">${tenantName || "Restaurant"}</div>
      <div class="center mb" style="font-size:10px">${branchName || ""}</div>
      <div class="mb" style="font-size:10px">Order: ${orderNumber} | ${new Date(date).toLocaleString()}</div>
      <table class="mb">
        <tr><th style="text-align:left">Item</th><th class="r">Qty</th><th class="r">Price</th></tr>
        ${(items || []).map(it => `<tr><td>${it.name}</td><td class="r">${it.qty}</td><td class="r">€${(it.total||0).toFixed(2)}</td></tr>`).join("")}
      </table>
      <div class="mb" style="border-top:1px solid #000; padding-top:6px">
        <div class="r">Subtotal: €${(subtotal||0).toFixed(2)}</div>
        <div class="r">Tax: €${(taxAmount||0).toFixed(2)}</div>
        ${discountAmount > 0 ? `<div class="r">Discount: -€${(discountAmount||0).toFixed(2)}</div>` : ""}
        <div class="r bold">Total: €${(grandTotal||0).toFixed(2)}</div>
      </div>
      <div class="mb" style="font-size:10px">
        ${(payments || []).map(p => `<div class="r">${p.method}: €${(p.amount||0).toFixed(2)}</div>`).join("")}
      </div>
      ${tseSignature ? `<div class="mb" style="font-size:9px; word-break:break-all">TSE: ${String(tseSignature).slice(0,30)}…</div>` : ""}
      <div class="center mt bold">Thank you!</div>
    </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
  w.onafterprint = () => w.close();
}
