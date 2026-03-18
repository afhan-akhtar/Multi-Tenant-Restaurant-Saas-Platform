"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { formatEur } from "@/lib/currencyFormat";

export default function ZReportsClient({ data, defaultDate }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState(defaultDate);

  const applyDate = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("date", date);
    router.push(`/z-reports?${params.toString()}`);
  }, [date, router, searchParams]);

  const exportZReport = useCallback(() => {
    const lines = [
      "════════════════════════════════",
      "         Z-REPORT (Daily Summary)",
      "════════════════════════════════",
      `Date: ${data.date}`,
      `Printed: ${new Date().toISOString()}`,
      "",
      "--- Summary ---",
      `Orders: ${data.summary.orderCount}`,
      `Gross Revenue: ${formatEur(data.summary.grossRevenue)}`,
      `Net Subtotal: ${formatEur(data.summary.netSubtotal)}`,
      `Tax: ${formatEur(data.summary.taxAmount)}`,
      "",
      "--- Payment Methods ---",
      ...data.paymentBreakdown.map((p) => `  ${p.method}: ${formatEur(p.amount)}`),
      "",
      "--- Cashbook ---",
      ...(data.cashbookEntries.length
        ? data.cashbookEntries.map((e) => `  ${e.type}: ${formatEur(e.amount)} (${new Date(e.createdAt).toLocaleString()})`)
        : ["  No entries"]),
      "",
      "════════════════════════════════",
      "DS-FinV-K compliant | For audit use",
      "════════════════════════════════",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `z-report-${data.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const { summary, orders, paymentBreakdown, cashbookEntries } = data;

  return (
    <div className="py-4 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="m-0 text-xl font-semibold text-color-text">Z-Reports</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-2 px-3 rounded-lg border border-color-border bg-color-card text-color-text text-sm"
          />
          <button
            type="button"
            onClick={applyDate}
            className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
          >
            Load
          </button>
          <button
            type="button"
            onClick={exportZReport}
            className="py-2 px-4 bg-color-bg text-color-text rounded-lg text-sm font-medium border border-color-border cursor-pointer hover:bg-color-border"
          >
            Export .txt
          </button>
        </div>
      </div>

      <p className="text-color-text-muted text-sm mb-6">
        Exportable Z-Reports compliant with German DS-FinV-K regulations. Daily sales summary for audit.
      </p>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Order Count</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{summary.orderCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Gross Revenue</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{formatEur(summary.grossRevenue)}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Net Subtotal</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{formatEur(summary.netSubtotal)}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Tax</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{formatEur(summary.taxAmount)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Payment Methods</h3>
          <div className="p-4">
            {paymentBreakdown.length > 0 ? (
              <ul className="m-0 p-0 list-none">
                {paymentBreakdown.map((p, i) => (
                  <li key={i} className="flex justify-between py-2 border-b border-color-border last:border-0">
                    <span className="text-color-text-muted">{p.method}</span>
                    <span className="font-medium">{formatEur(p.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-color-text-muted text-sm">No payments this day</p>
            )}
          </div>
        </div>

        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Cashbook Entries</h3>
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            {cashbookEntries.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-color-bg border-b border-color-border">
                    <th className="py-2 px-4 text-left font-semibold text-color-text">Type</th>
                    <th className="py-2 px-4 text-right font-semibold text-color-text">Amount</th>
                    <th className="py-2 px-4 text-left font-semibold text-color-text">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {cashbookEntries.map((e) => (
                    <tr key={e.id} className="border-b border-color-border last:border-0">
                      <td className="py-2 px-4">{e.type}</td>
                      <td className="py-2 px-4 text-right">{formatEur(e.amount)}</td>
                      <td className="py-2 px-4 text-color-text-muted text-xs">
                        {new Date(e.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-color-text-muted text-sm">No cashbook entries this day</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Orders</h3>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          {orders.length > 0 ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Order #</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Time</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4">{o.orderNumber}</td>
                    <td className="py-2 px-4 text-color-text-muted">
                      {new Date(o.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-4 text-right">{formatEur(o.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-color-text-muted text-sm">No orders this day</div>
          )}
        </div>
      </div>
    </div>
  );
}
