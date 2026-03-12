"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

/**
 * Receipt QR: TSE fiscal data (KassenSichV) when available, else receipt URL.
 * Per Fiskaly: https://developer.fiskaly.com/de/sign-de/receipt-data
 */
export function ReceiptQRCode({ url, tseQrData }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    // Per KassenSichV/Fiskaly receipt spec, QR should encode TSE verification data (e.g. "V0;..."),
    // not a URL. If no TSE payload is available, we don't render a QR.
    if (!tseQrData) {
      setDataUrl(null);
      return;
    }

    if (typeof tseQrData === "string" && tseQrData.startsWith("data:")) {
      setDataUrl(tseQrData);
      return;
    }

    // Fiscal payloads (e.g. "V0;...") are longer than URLs -> denser QR.
    // Use larger size + quiet zone so phone cameras can scan reliably.
    QRCode.toDataURL(String(tseQrData).trim(), { width: 240, margin: 3, errorCorrectionLevel: "M" })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url, tseQrData]);

  return (
    <div className="mb-6 flex flex-col items-center">
      {dataUrl ? (
        <Image
          src={dataUrl}
          alt="TSE verification data (KassenSichV)"
          width={140}
          height={140}
          className="w-[140px] h-[140px]"
          unoptimized
        />
      ) : (
        <div className="w-[140px] h-[140px] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
          {tseQrData ? "Loading…" : ""}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        {tseQrData ? "TSE data (KassenSichV)" : ""}
      </div>
    </div>
  );
}
