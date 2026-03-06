"use client";

/**
 * German TSE-style digital receipt.
 * Uses POS + payment data only: tenant, branch, items, payments, TSE signature.
 */
import { useRef, useEffect } from "react";
import Image from "next/image";

const ACCENT = "#14b8a6";

function computeVatBreakdown(items, discountAmount = 0) {
  const byRate = {};
  let subtotalNet = 0;
  for (const it of items || []) {
    const total = Number(it.total) || 0;
    const rate = Number(it.taxRate) || 10;
    if (!byRate[rate]) byRate[rate] = { net: 0, vat: 0, gross: 0 };
    byRate[rate].net += total;
    byRate[rate].vat += total * (rate / 100);
    byRate[rate].gross += total * (1 + rate / 100);
    subtotalNet += total;
  }
  const subtotalGross = Object.values(byRate).reduce((s, r) => s + r.gross, 0);
  const taxTotal = Object.values(byRate).reduce((s, r) => s + r.vat, 0);
  const discount = Number(discountAmount) || 0;
  const grandTotal = Math.max(0, subtotalGross - discount);
  return { byRate: Object.entries(byRate).sort((a, b) => b[0] - a[0]), subtotalNet, subtotalGross, taxTotal, grandTotal, discount };
}

const STYLE = `
  @media print {
    body * { visibility: hidden; }
    #receipt-print-area, #receipt-print-area * { visibility: visible; }
    #receipt-print-area { position: absolute; left: 0; top: 0; width: 100%; max-width: 400px; }
  }
`;

export function Receipt({ receipt, onPrinted }) {
  const printRef = useRef(null);

  useEffect(() => {
    if (!receipt || !printRef.current) return;
    const el = printRef.current;
    const beforePrint = () => { el.style.display = "block"; };
    const afterPrint = () => { el.style.display = "none"; onPrinted?.(); };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [receipt, onPrinted]);

  if (!receipt) return null;

  const {
    tenantName,
    branchName,
    branchAddress,
    orderNumber,
    date,
    items,
    subtotal,
    taxAmount,
    discountAmount,
    grandTotal,
    payments,
    tseSignature,
    taxId,
    receiptUrl,
  } = receipt;

  const { byRate, subtotalNet, subtotalGross, grandTotal: computedTotal } = computeVatBreakdown(items, discountAmount);

  const qrData = receiptUrl || `Receipt ${orderNumber} | ${tenantName || "Restaurant"} | ${new Date(date).toLocaleString()}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

  return (
    <>
      <style>{STYLE}</style>
      <div
        id="receipt-print-area"
        ref={printRef}
        className="hidden print:block bg-white text-black max-w-[400px] mx-auto font-sans text-sm"
      >
        <div style={{ background: ACCENT, height: 4 }} />
        <div className="px-4 py-4">
          <div className="text-center mb-4">
            <div className="font-bold text-lg">{tenantName || "Restaurant"}</div>
            {branchName && (
              <div className="text-xs text-gray-600 mt-1">
                {branchName}
              </div>
            )}
            {taxId && <div className="text-xs text-gray-500 mt-0.5">{taxId}</div>}
          </div>

          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h2 className="font-semibold text-base">Receipt</h2>
            <div className="text-right text-xs">
              <div>Nr. {orderNumber}</div>
              <div className="text-gray-600">{new Date(date).toLocaleString()}</div>
            </div>
          </div>

          <div className="mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-2 pr-2">DESCRIPTION</th>
                  <th className="py-2 text-right w-12">QTY</th>
                  <th className="py-2 text-right w-14">VAT</th>
                  <th className="py-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((it, i) => {
                  const net = Number(it.total) || 0;
                  const rate = Number(it.taxRate) || 10;
                  const gross = net * (1 + rate / 100);
                  return (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-2">{it.name}</td>
                      <td className="py-2 text-right">{it.qty}</td>
                      <td className="py-2 text-right">{rate}%</td>
                      <td className="py-2 text-right">€{gross.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-1 text-right mb-4 border-t border-gray-200 pt-2">
            <div>Subtotal total incl. VAT: €{(subtotalGross || subtotal || 0).toFixed(2)}</div>
            <div>Sum total excl. VAT: €{(subtotalNet || 0).toFixed(2)}</div>
            {(discountAmount || 0) > 0 && (
              <div className="text-amber-600">Discount total incl. VAT: -€{Number(discountAmount).toFixed(2)}</div>
            )}
            <div className="font-bold text-base">Sum total incl. VAT: €{(computedTotal || grandTotal || 0).toFixed(2)}</div>
          </div>

          {byRate.length > 0 && (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1 text-left">VAT</th>
                    <th className="py-1 text-right">Net</th>
                    <th className="py-1 text-right">VAT</th>
                    <th className="py-1 text-right">Gross</th>
                  </tr>
                </thead>
                <tbody>
                  {byRate.map(([rate, v]) => (
                    <tr key={rate} className="border-b border-gray-100">
                      <td className="py-1">{rate}%</td>
                      <td className="py-1 text-right">€{v.net.toFixed(2)}</td>
                      <td className="py-1 text-right">€{v.vat.toFixed(2)}</td>
                      <td className="py-1 text-right">€{v.gross.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ background: ACCENT }} className="px-3 py-2 rounded mb-3">
            <div className="text-white text-xs font-medium mb-1">Payment</div>
            {(payments || []).map((p, i) => (
              <div key={i} className="flex justify-between text-white text-sm">
                <span>{p.method}</span>
                <span>€{(p.amount || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {tseSignature && (
            <div className="mb-4 p-2 bg-gray-50 rounded text-xs break-all border border-gray-200">
              <span className="font-medium">TSE: </span>
              {String(tseSignature).slice(0, 48)}…
            </div>
          )}

          <div className="mb-4 flex flex-col items-center">
            <Image
              src={qrSrc}
              alt="Scan receipt"
              width={120}
              height={120}
              className="w-[120px] h-[120px]"
            />
            <div className="text-xs text-gray-500 mt-1">Scan to view receipt</div>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded text-sm font-medium text-white hover:opacity-90"
              style={{ background: ACCENT }}
            >
              Save as PDF
            </button>
          </div>

          <div style={{ background: ACCENT, height: 4 }} />
          <div className="text-center py-4 text-gray-600 text-sm">
            Thank you for your order!
          </div>
        </div>
      </div>
    </>
  );
}

export function printReceipt(receipt) {
  if (!receipt) return;
  const w = window.open("", "_blank", "width=420,height=700");
  if (!w) return;

  const {
    tenantName,
    branchName,
    branchAddress,
    orderNumber,
    date,
    items,
    subtotal,
    taxAmount,
    discountAmount,
    grandTotal,
    payments,
    tseSignature,
    taxId,
    receiptUrl,
  } = receipt;

  const qrData = receiptUrl || `Receipt ${orderNumber} | ${tenantName || "Restaurant"} | ${new Date(date).toLocaleString()}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

  const { byRate, subtotalGross, subtotalNet, grandTotal: computedTotal } = computeVatBreakdown(items, discountAmount);

  const itemsHtml = (items || []).map((it) => {
    const net = Number(it.total) || 0;
    const rate = Number(it.taxRate) || 10;
    const gross = (net * (1 + rate / 100)).toFixed(2);
    return `<tr><td>${it.name}</td><td class="r">${it.qty}</td><td class="r">${rate}%</td><td class="r">€${gross}</td></tr>`;
  }).join("");

  const vatRows = byRate.map(
    ([rate, v]) =>
      `<tr><td>${rate}%</td><td class="r">€${v.net.toFixed(2)}</td><td class="r">€${v.vat.toFixed(2)}</td><td class="r">€${v.gross.toFixed(2)}</td></tr>`
  ).join("");

  const paymentsHtml = (payments || []).map((p) => `<div class="flex"><span>${p.method}</span><span class="ml-auto">€${(p.amount || 0).toFixed(2)}</span></div>`).join("");

  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head><title>Receipt ${orderNumber}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:system-ui,-apple-system,sans-serif;font-size:14px;padding:16px;color:#111;}
      .accent{background:#14b8a6;}
      .accent-text{color:#14b8a6;}
      .center{text-align:center;}
      .bold{font-weight:bold;}
      .r{text-align:right;}
      table{width:100%;border-collapse:collapse;}
      th,td{padding:6px 4px;}
      .flex{display:flex;justify-content:space-between;}
      .mb{margin-bottom:12px;}
      .mt{margin-top:12px;}
    </style>
    </head>
    <body>
      <div class="accent" style="height:4px;"></div>
      <div class="mb mt center">
        <div class="bold" style="font-size:1.1rem;">${tenantName || "Restaurant"}</div>
        <div style="font-size:12px;color:#666;">${branchName || ""}</div>
        ${taxId ? `<div style="font-size:11px;color:#888;">${taxId}</div>` : ""}
      </div>
      <div class="flex mb" style="border-bottom:1px solid #ddd;padding-bottom:8px;">
        <span class="bold">Receipt</span>
        <div class="r" style="font-size:12px;">
          <div>Nr. ${orderNumber}</div>
          <div style="color:#666;">${new Date(date).toLocaleString()}</div>
        </div>
      </div>
      <table class="mb">
        <tr style="border-bottom:1px solid #ccc;"><th style="text-align:left">DESCRIPTION</th><th class="r">QTY</th><th class="r">VAT</th><th class="r">TOTAL</th></tr>
        ${itemsHtml}
      </table>
      <div class="mb" style="border-top:1px solid #ddd;padding-top:8px;text-align:right;">
        <div>Subtotal total incl. VAT: €${(subtotalGross || subtotal || 0).toFixed(2)}</div>
        <div>Sum total excl. VAT: €${(subtotalNet || 0).toFixed(2)}</div>
        ${(discountAmount || 0) > 0 ? `<div style="color:#b45309;">Discount: -€${Number(discountAmount).toFixed(2)}</div>` : ""}
        <div class="bold mt">Sum total incl. VAT: €${(computedTotal || grandTotal || 0).toFixed(2)}</div>
      </div>
      ${vatRows ? `<table class="mb" style="font-size:12px;"><tr style="border-bottom:1px solid #ccc;"><th style="text-align:left">VAT</th><th class="r">Net</th><th class="r">VAT</th><th class="r">Gross</th></tr>${vatRows}</table>` : ""}
      <div class="accent" style="padding:10px;border-radius:6px;color:white;margin-bottom:12px;">
        <div style="font-size:11px;margin-bottom:4px;">Payment</div>
        ${paymentsHtml}
      </div>
      ${tseSignature ? `<div class="mb" style="font-size:11px;word-break:break-all;padding:8px;background:#f5f5f5;border-radius:4px;">TSE: ${String(tseSignature).slice(0,50)}…</div>` : ""}
      <div class="mb center">
        <img src="${qrSrc}" alt="Scan receipt" style="width:120px;height:120px;" />
        <div style="font-size:11px;color:#666;margin-top:4px;">Scan to view receipt</div>
      </div>
      <div class="accent" style="height:4px;"></div>
      <div class="center mt" style="color:#666;font-size:13px;">Thank you for your order!</div>
    </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
  w.onafterprint = () => w.close();
}
