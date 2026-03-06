"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function ReceiptQRCode({ url }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { width: 120, margin: 1 })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url]);

  return (
    <div className="mb-6 flex flex-col items-center">
      {dataUrl ? (
        <img src={dataUrl} alt="Scan receipt" className="w-[120px] h-[120px]" />
      ) : (
        <div className="w-[120px] h-[120px] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
          {url ? "Loading…" : ""}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-1">Scan to view receipt</div>
    </div>
  );
}
