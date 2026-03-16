"use client";

/**
 * German TSE-style digital receipt.
 * Uses POS + payment data only: tenant, branch, items, payments, TSE signature.
 */
import { useRef, useEffect } from "react";
import { ReceiptQRCode } from "@/app/components/ReceiptQRCode";

const ACCENT = "#14b8a6";

function buildTseV0QrPayload(receipt) {
  if (!receipt) return null;

  const tenantName = receipt.tenantName || "Restaurant";
  const orderNumber = receipt.orderNumber || receipt.orderNo || receipt.receiptNumber;

  // Fiskaly API fields (preferred) + backward-compatible fields
  const fiscalTssId = receipt.tss_id ?? receipt.tssId ?? receipt.tseTssId;
  const fiscalTxId = receipt.tx_id ?? receipt.tseTransactionId ?? receipt.txId;
  const fiscalSignatureCounter = receipt.signature_counter ?? receipt.signatureCounter;
  const fiscalStartTime = receipt.log_time_start ?? receipt.logTimeStart;
  const fiscalEndTime = receipt.log_time_end ?? receipt.logTimeEnd ?? receipt.tseSignedAt;
  const fiscalSignature = receipt.signature ?? receipt.tseSignature;

  const amount = Number(receipt.grandTotal ?? receipt.total ?? receipt.amount);

  if (
    !orderNumber ||
    !fiscalStartTime ||
    !fiscalEndTime ||
    !Number.isFinite(amount) ||
    !fiscalSignatureCounter ||
    !fiscalTxId ||
    !fiscalTssId ||
    !fiscalSignature
  ) {
    return null;
  }

  // Format mirrors typical KassenSichV "V0;...;Signature" payload.
  return [
    "V0",
    tenantName,
    String(orderNumber),
    String(fiscalStartTime),
    String(fiscalEndTime),
    amount.toFixed(2),
    "EUR",
    String(fiscalSignatureCounter),
    String(fiscalTxId),
    String(fiscalTssId),
    String(fiscalSignature),
  ].join(";");
}

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
    /* Thermal printer friendly defaults (80mm paper). */
    @page { size: 80mm auto; margin: 0mm; }
    html, body { width: 80mm; margin: 0; padding: 0; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body * { visibility: hidden; }
    #receipt-print-area, #receipt-print-area * { visibility: visible; }
    #receipt-print-area { position: absolute; left: 0; top: 0; width: 80mm; max-width: 80mm; }
    /* Avoid clipping on some thermal drivers */
    #receipt-print-area { overflow: visible; }
  }
`;

export function Receipt({ receipt, onPrinted, embedded = false }) {
  const printRef = useRef(null);

  useEffect(() => {
    if (embedded) return;
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
  }, [receipt, onPrinted, embedded]);

  if (!receipt) return null;

  const {
    tenantName,
    tenantLogo,
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
    tseTransactionId,
    tseSignedAt,
    tseQueued,
    taxId,
    receiptUrl,
    orgVat,
    orgTaxNumber,
    orgWidnr,
    // Fiskaly API fields (preferred)
    tss_id,
    tx_id,
    signature_counter,
    log_time_start,
    log_time_end,
    signature,
  } = receipt;

  const { byRate, subtotalNet, subtotalGross, taxTotal, grandTotal: computedTotal } = computeVatBreakdown(items, discountAmount);

  const cashPayment = (payments || []).find((p) => p.method === "CASH");
  const cashReceived = cashPayment ? Number(cashPayment.amount || 0) : null;
  const cashChange =
    cashReceived != null
      ? Math.max(0, cashReceived - (computedTotal || grandTotal || 0))
      : null;

  // Backward-compatible mapping (older receipts used tse* fields)
  const fiscalTssId = tss_id ?? receipt?.tssId ?? receipt?.tseTssId;
  const fiscalTxId = tx_id ?? tseTransactionId ?? receipt?.txId;
  const fiscalSignatureCounter = signature_counter ?? receipt?.signatureCounter;
  const fiscalStartTime = log_time_start ?? receipt?.logTimeStart;
  const fiscalEndTime = log_time_end ?? receipt?.logTimeEnd ?? tseSignedAt;
  const fiscalSignature = signature ?? tseSignature;

  // QR must contain TSE verification data (KassenSichV), not a URL.
  const qrData = receipt?.tseQrData || receipt?.qrCodeData || buildTseV0QrPayload(receipt);

  return (
    <>
      <style>{STYLE}</style>
      <div
        id="receipt-print-area"
        ref={printRef}
        className={`${embedded ? "block" : "hidden print:block"} bg-white text-black max-w-[400px] mx-auto font-sans text-sm`}
      >
        <div style={{ background: ACCENT, height: 4 }} />
        <div className="px-4 py-4">
          <div className="text-center mb-4">
            {/* Match sidebar logo style: square with initial */}
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 min-w-10 bg-[#6366f1] text-white rounded-md flex items-center justify-center font-bold text-xl">
                {(tenantName || "R").charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="font-bold text-lg">{tenantName || "Restaurant"}</div>
            {branchName && (
              <div className="text-xs text-gray-600 mt-1">
                {branchName}
              </div>
            )}
            {branchAddress && (
              <div className="text-xs text-gray-600 mt-0.5">
                {branchAddress}
              </div>
            )}
            {taxId && <div className="text-xs text-gray-500 mt-0.5">{taxId}</div>}
            {(orgVat || orgTaxNumber || orgWidnr) && (
              <div className="mt-3 inline-flex flex-col items-stretch text-xs text-gray-800">
                <div className="rounded-md border border-teal-100 bg-teal-50/60 px-3 py-2 text-left shadow-[0_1px_2px_rgba(15,118,110,0.15)]">
                  <div className="space-y-0.5">
                    {orgVat && (
                      <div className="flex items-center justify-between gap-6">
                        <span className="text-[11px] text-gray-600">VAT</span>
                        <span className="font-semibold tracking-wide text-gray-900">{orgVat}</span>
                      </div>
                    )}
                    {orgTaxNumber && (
                      <div className="flex items-center justify-between gap-6">
                        <span className="text-[11px] text-gray-600">Tax Number</span>
                        <span className="font-semibold tracking-wide text-gray-900">{orgTaxNumber}</span>
                      </div>
                    )}
                    {orgWidnr && (
                      <div className="flex items-center justify-between gap-6">
                        <span className="text-[11px] text-gray-600">W-IdNr.</span>
                        <span className="font-semibold tracking-wide text-gray-900">{orgWidnr}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                  <th className="py-2 pr-3">DESCRIPTION</th>
                  <th className="py-2 px-2 text-right w-28 whitespace-nowrap">QTY × PRICE</th>
                  <th className="py-2 px-2 text-right w-16">VAT</th>
                  <th className="py-2 pl-2 text-right w-20">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((it, i) => {
                  const net = Number(it.total) || 0;
                  const rate = Number(it.taxRate) || 10;
                  const qty = Number(it.qty) || 0;
                  const unitNet = qty > 0 ? net / qty : net;
                  const unitGross = unitNet * (1 + rate / 100);
                  const lineGross = unitGross * qty;
                  return (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3 align-top">{it.name}</td>
                      <td className="py-2 px-2 text-right align-top whitespace-nowrap">
                        {qty} × €{unitGross.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-right align-top">{rate}%</td>
                      <td className="py-2 pl-2 text-right align-top whitespace-nowrap">
                        €{lineGross.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-0.5 text-right mb-3 border-t border-gray-200 pt-2">
            <div>Subtotal (excl. VAT): €{(subtotalNet || 0).toFixed(2)}</div>
            <div>VAT (10%): €{(taxTotal || taxAmount || 0).toFixed(2)}</div>
            {(discountAmount || 0) > 0 && (
              <div className="text-amber-600">Discount (incl. VAT): -€{Number(discountAmount).toFixed(2)}</div>
            )}
            <div className="font-bold text-base">Total (incl. VAT): €{(computedTotal || grandTotal || 0).toFixed(2)}</div>
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
            {cashReceived != null && (
              <div className="mt-2 text-[11px] text-teal-50 space-y-0.5">
                <div className="flex justify-between">
                  <span>Cash received</span>
                  <span>€{cashReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change given</span>
                  <span>€{cashChange.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200 space-y-1">
            <div className="font-medium text-xs text-gray-700">Fiskaly TSE (KassenSichV)</div>
            {fiscalSignature ? (
              <div className="text-[11px] leading-snug break-all">
                <div>TSS Serial: {fiscalTssId ?? "—"}</div>
                <div>Transaction ID: {fiscalTxId ?? "—"}</div>
                <div>Signature Counter: {fiscalSignatureCounter ?? "—"}</div>
                <div className="mt-1">Start Time: {fiscalStartTime ?? "—"}</div>
                <div>End Time: {fiscalEndTime ?? "—"}</div>
                <div className="mt-1">Signature: {String(fiscalSignature)}</div>
              </div>
            ) : tseQueued ? (
              <span className="text-amber-600 text-xs">Pending (will be signed by daily migration)</span>
            ) : (
              <span className="text-amber-600 text-xs">Pending (check server logs)</span>
            )}
          </div>

          <ReceiptQRCode url={receiptUrl} tseQrData={qrData} />

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
    tenantLogo,
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
    tseTransactionId,
    tseSignedAt,
    tseQueued,
    taxId,
    receiptUrl,
    // Fiskaly API fields (preferred)
    tss_id,
    tx_id,
    signature_counter,
    log_time_start,
    log_time_end,
    signature,
    orgVat,
    orgTaxNumber,
    orgWidnr,
  } = receipt;

  const fiscalTssId = tss_id ?? receipt?.tssId ?? receipt?.tseTssId;
  const fiscalTxId = tx_id ?? tseTransactionId ?? receipt?.txId;
  const fiscalSignatureCounter = signature_counter ?? receipt?.signatureCounter;
  const fiscalStartTime = log_time_start ?? receipt?.logTimeStart;
  const fiscalEndTime = log_time_end ?? receipt?.logTimeEnd ?? tseSignedAt;
  const fiscalSignature = signature ?? tseSignature;

  const tseDisplay = fiscalSignature
    ? `<div><strong>Fiskaly TSE (KassenSichV)</strong></div>
       <div style="margin-top:4px;">TSS Serial: ${fiscalTssId ?? "—"}</div>
       <div>Transaction ID: ${fiscalTxId ?? "—"}</div>
       <div>Signature Counter: ${fiscalSignatureCounter ?? "—"}</div>
       <div style="margin-top:6px;">Start Time: ${fiscalStartTime ?? "—"}</div>
       <div>End Time: ${fiscalEndTime ?? "—"}</div>
       <div style="margin-top:6px;word-break:break-all;">Signature: ${String(fiscalSignature)}</div>`
    : tseQueued
      ? `<div><strong>Fiskaly TSE (KassenSichV)</strong></div><div style="margin-top:4px;color:#b45309;">Pending (will be signed by daily migration)</div>`
      : `<div><strong>Fiskaly TSE (KassenSichV)</strong></div><div style="margin-top:4px;color:#b45309;">Pending</div>`;

  const qrData = receipt?.tseQrData || receipt?.qrCodeData || buildTseV0QrPayload(receipt);
  const qrPayload = String(qrData || "").trim();
  // Higher resolution + quiet zone improves scanning on thermal/PDF.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=4&data=${encodeURIComponent(qrPayload)}`;

  const { byRate, subtotalGross, subtotalNet, taxTotal, grandTotal: computedTotal } = computeVatBreakdown(items, discountAmount);

  const cashPayment = (payments || []).find((p) => p.method === "CASH");
  const cashReceived = cashPayment ? Number(cashPayment.amount || 0) : null;
  const cashChange =
    cashReceived != null
      ? Math.max(0, cashReceived - (computedTotal || grandTotal || 0))
      : null;

  const itemsHtml = (items || [])
    .map((it) => {
      const net = Number(it.total) || 0;
      const rate = Number(it.taxRate) || 10;
      const qty = Number(it.qty) || 0;
      const unitNet = qty > 0 ? net / qty : net;
      const unitGross = unitNet * (1 + rate / 100);
      const lineGross = unitGross * qty;
      return `<tr><td>${it.name}</td><td class="r">${qty} × €${unitGross.toFixed(
        2
      )}</td><td class="r">${rate}%</td><td class="r">€${lineGross.toFixed(
        2
      )}</td></tr>`;
    })
    .join("");

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
        <div style="margin-bottom:8px;display:flex;justify-content:center;">
          <div style="width:40px;height:40px;min-width:40px;background:#6366f1;color:white;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.25rem;">${(tenantName || "R").charAt(0).toUpperCase()}</div>
        </div>
        ${tenantLogo ? `<div style="margin-bottom:12px;"><img src="${tenantLogo}" alt="" style="max-height:64px;max-width:180px;object-fit:contain;" /></div>` : ""}
        <div class="bold" style="font-size:1.1rem;">${tenantName || "Restaurant"}</div>
        <div style="font-size:12px;color:#666;">${branchName || ""}</div>
        ${branchAddress ? `<div style="font-size:12px;color:#666;">${branchAddress}</div>` : ""}
        ${taxId ? `<div style="font-size:11px;color:#888;">${taxId}</div>` : ""}
        ${
          orgVat || orgTaxNumber || orgWidnr
            ? `<div style="margin-top:8px;display:inline-flex;flex-direction:column;align-items:stretch;font-size:11px;color:#111;">
                 <div style="border-radius:6px;border:1px solid rgba(45,212,191,0.5);background:rgba(240,253,250,0.9);padding:6px 10px;box-shadow:0 1px 2px rgba(15,118,110,0.15);text-align:left;">
                   <div style="display:flex;flex-direction:column;gap:2px;">
                     ${
                       orgVat
                         ? `<div style="display:flex;justify-content:space-between;gap:24px;">
                              <span style="font-size:10px;color:#4b5563;">VAT</span>
                              <span style="font-weight:600;color:#111827;">${orgVat}</span>
                            </div>`
                         : ""
                     }
                     ${
                       orgTaxNumber
                         ? `<div style="display:flex;justify-content:space-between;gap:24px;">
                              <span style="font-size:10px;color:#4b5563;">Tax Number</span>
                              <span style="font-weight:600;color:#111827;">${orgTaxNumber}</span>
                            </div>`
                         : ""
                     }
                     ${
                       orgWidnr
                         ? `<div style="display:flex;justify-content:space-between;gap:24px;">
                              <span style="font-size:10px;color:#4b5563;">W-IdNr.</span>
                              <span style="font-weight:600;color:#111827;">${orgWidnr}</span>
                            </div>`
                         : ""
                     }
                   </div>
                 </div>
               </div>`
            : ""
        }
      </div>
      <div class="flex mb" style="border-bottom:1px solid #ddd;padding-bottom:8px;">
        <span class="bold">Receipt</span>
        <div class="r" style="font-size:12px;">
          <div>Nr. ${orderNumber}</div>
          <div style="color:#666;">${new Date(date).toLocaleString()}</div>
        </div>
      </div>
      <table class="mb">
        <tr style="border-bottom:1px solid #ccc;">
          <th style="text-align:left;padding:8px 12px 8px 0;">DESCRIPTION</th>
          <th class="r" style="padding:8px 8px;white-space:nowrap;">QTY × PRICE</th>
          <th class="r" style="padding:8px 8px;">VAT</th>
          <th class="r" style="padding:8px 0 8px 8px;white-space:nowrap;">TOTAL</th>
        </tr>
        ${itemsHtml}
      </table>
      <div class="mb" style="border-top:1px solid #ddd;padding-top:8px;text-align:right;line-height:1.4;">
        <div>Subtotal (excl. VAT): €${(subtotalNet || 0).toFixed(2)}</div>
        <div>VAT (10%): €${(taxTotal || taxAmount || 0).toFixed(2)}</div>
        ${(discountAmount || 0) > 0 ? `<div style="color:#b45309;">Discount (incl. VAT): -€${Number(discountAmount).toFixed(2)}</div>` : ""}
        <div class="bold" style="margin-top:2px;">Total (incl. VAT): €${(computedTotal || grandTotal || 0).toFixed(2)}</div>
      </div>
      ${vatRows ? `<table class="mb" style="font-size:12px;"><tr style="border-bottom:1px solid #ccc;"><th style="text-align:left">VAT</th><th class="r">Net</th><th class="r">VAT</th><th class="r">Gross</th></tr>${vatRows}</table>` : ""}
      <div class="accent" style="padding:10px;border-radius:6px;color:white;margin-bottom:8px;">
        <div style="font-size:11px;margin-bottom:4px;">Payment</div>
        ${paymentsHtml}
        ${
          cashReceived != null
            ? `<div style="margin-top:6px;font-size:11px;line-height:1.3;">
                 <div class="flex"><span>Cash received</span><span class="ml-auto">€${cashReceived.toFixed(
                   2
                 )}</span></div>
                 <div class="flex"><span>Change given</span><span class="ml-auto">€${cashChange.toFixed(
                   2
                 )}</span></div>
               </div>`
            : ""
        }
      </div>
      <div class="mb" style="font-size:11px;line-height:1.25;padding:8px;background:#f5f5f5;border-radius:4px;">${tseDisplay}</div>
      <div class="mb center">
        ${qrPayload ? `<img src="${qrSrc}" alt="TSE data (KassenSichV)" style="width:120px;height:120px;" />` : ""}
        <div style="font-size:11px;color:#666;margin-top:4px;">${qrPayload ? "TSE data (KassenSichV)" : ""}</div>
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
