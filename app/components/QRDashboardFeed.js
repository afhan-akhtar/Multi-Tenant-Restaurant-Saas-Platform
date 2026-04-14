"use client";

import { useCallback, useEffect, useState } from "react";
import { formatEur } from "@/lib/currencyFormat";
import Link from "next/link";

export default function QRDashboardFeed() {
  const [orders, setOrders] = useState([]);
  const [live, setLive] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/qr/dashboard-feed", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const source = new EventSource("/api/qr/dashboard-stream");
    source.onopen = () => setLive(true);
    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (
          message?.event === "order.created" ||
          message?.event === "order.updated" ||
          message?.event === "order.cancelled"
        ) {
          load();
        }
      } catch {
        /* ignore */
      }
    };
    source.onerror = () => setLive(false);
    return () => {
      source.close();
      setLive(false);
    };
  }, [load]);

  if (error) {
    return null;
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-emerald-950 m-0">QR table orders (live)</h3>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
            title={live ? "Connected" : "Reconnecting…"}
          />
          <Link href="/table-qr" className="text-emerald-800 underline font-medium">
            QR codes
          </Link>
        </div>
      </div>
      <ul className="space-y-2 m-0 p-0 list-none">
        {orders.slice(0, 8).map((o) => (
          <li
            key={o.id}
            className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-emerald-950 border-b border-emerald-100/80 last:border-0 pb-2 last:pb-0"
          >
            <span className="font-medium">
              {o.orderNumber}
              {o.table?.name ? (
                <span className="text-emerald-800/90 font-normal"> · {o.table.name}</span>
              ) : null}
            </span>
            <span className="text-emerald-900/90">{formatEur(o.grandTotal)} · {o.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
