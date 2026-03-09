"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Receipt QR: TSE fiscal data (KassenSichV) when available, else receipt URL.
 * Per Fiskaly: https://developer.fiskaly.com/de/sign-de/receipt-data
 */
export function ReceiptQRCode({ url, tseQrData }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (tseQrData) {
      if (typeof tseQrData === "string" && tseQrData.startsWith("data:")) {
        setDataUrl(tseQrData);
      } else {
        QRCode.toDataURL(String(tseQrData), { width: 120, margin: 1 })
          .then(setDataUrl)
          .catch(() => setDataUrl(null));
      }
      return;
    }
    if (!url) return;
    QRCode.toDataURL(url, { width: 120, margin: 1 })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url, tseQrData]);

  return (
    <div className="mb-6 flex flex-col items-center">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={tseQrData ? "TSE fiscal data (KassenSichV)" : "Scan to view receipt"}
          className="w-[120px] h-[120px]"
        />
      ) : (
        <div className="w-[120px] h-[120px] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
          {url || tseQrData ? "Loading…" : ""}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        {tseQrData ? "TSE data (KassenSichV)" : "Scan to view receipt"}
      </div>
    </div>
  );
}
