"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

export default function TableQRCodes({ tenantId, tables = [], baseUrl }) {
  const [dataUrls, setDataUrls] = useState({});

  const rows = useMemo(
    () =>
      [...tables].sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), undefined, { numeric: true })
      ),
    [tables]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = {};
      for (const t of rows) {
        const url = `${baseUrl.replace(/\/$/, "")}/menu?tenant_id=${tenantId}&table_id=${t.id}`;
        try {
          next[t.id] = await QRCode.toDataURL(url, {
            width: 280,
            margin: 2,
            color: { dark: "#1a1d29", light: "#ffffff" },
          });
        } catch {
          next[t.id] = "";
        }
      }
      if (!cancelled) setDataUrls(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, tenantId, rows]);

  const downloadPng = (tableId, name) => {
    const dataUrl = dataUrls[tableId];
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `table-${name || tableId}-qr.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-color-text-muted m-0 max-w-2xl">
        Guests scan a code to open the menu for that table. If your plan includes online payments and Stripe is
        connected, guests pay by card before the order is sent to the kitchen. Otherwise the order is placed
        without in-app payment and you settle at the table or POS. Orders appear as{" "}
        <strong className="text-color-text">QR · Dine-in</strong> in the kitchen and on the dashboard.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((t) => {
          const href = `${baseUrl.replace(/\/$/, "")}/menu?tenant_id=${tenantId}&table_id=${t.id}`;
          return (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-color-border p-4 shadow-sm flex flex-col items-center text-center"
            >
              <div className="text-sm font-semibold text-color-text m-0 mb-1">{t.name}</div>
              <div className="text-xs text-color-text-muted mb-3">
                {t.branch?.name ? `${t.branch.name} · ` : ""}#{t.id}
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 mb-3 min-h-[200px] flex items-center justify-center w-full">
                {dataUrls[t.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dataUrls[t.id]} alt="" className="max-w-full h-auto" width={280} height={280} />
                ) : (
                  <span className="text-slate-400 text-sm">Generating…</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 break-all m-0 mb-3 w-full">{href}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  className="py-2 px-3 rounded-lg bg-primary text-white text-sm font-medium"
                  onClick={() => downloadPng(t.id, t.name)}
                  disabled={!dataUrls[t.id]}
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  className="py-2 px-3 rounded-lg border border-color-border text-sm"
                  onClick={() => {
                    window.open(href, "_blank", "noopener,noreferrer");
                  }}
                >
                  Open menu
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {rows.length === 0 && (
        <p className="text-color-text-muted text-sm">No tables yet. Add tables under Floor &amp; Tables.</p>
      )}
    </div>
  );
}
