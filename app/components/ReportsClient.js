"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const Eur = (n) => `€${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

export default function ReportsClient({ report, defaultFrom, defaultTo }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const applyDateRange = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("from", from);
    params.set("to", to);
    router.push(`/reports?${params.toString()}`);
  }, [from, to, router, searchParams]);

  const { summary, topProducts, salesByDay, payments } = report;
  const totalPayments = payments.reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="py-4 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="m-0 text-xl font-semibold text-color-text">Reports</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="py-2 px-3 rounded-lg border border-color-border bg-color-card text-color-text text-sm"
          />
          <span className="text-color-text-muted">–</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="py-2 px-3 rounded-lg border border-color-border bg-color-card text-color-text text-sm"
          />
          <button
            type="button"
            onClick={applyDateRange}
            className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Revenue</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{Eur(summary.revenue)}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Tax</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{Eur(summary.tax)}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Orders</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{summary.orders}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Discounts</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{Eur(summary.discount)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Product</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Qty</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4 text-right">{p.quantity}</td>
                    <td className="py-2 px-4 text-right">{Eur(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topProducts.length === 0 && (
            <div className="py-8 text-center text-color-text-muted text-sm">No sales in this period</div>
          )}
        </div>

        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Sales by Day</h3>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Date</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Orders</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesByDay.map((d, i) => (
                  <tr key={i} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4">{d.date}</td>
                    <td className="py-2 px-4 text-right">{d.orders}</td>
                    <td className="py-2 px-4 text-right">{Eur(d.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {salesByDay.length === 0 && (
            <div className="py-8 text-center text-color-text-muted text-sm">No sales in this period</div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Payment Methods</h3>
        <div className="p-4">
          <div className="flex flex-wrap gap-4">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-color-text-muted text-sm">{p.method}</span>
                <span className="font-medium text-color-text">{Eur(p.amount)}</span>
                {totalPayments > 0 && (
                  <span className="text-xs text-color-text-muted">
                    ({Math.round((p.amount / totalPayments) * 100)}%)
                  </span>
                )}
              </div>
            ))}
          </div>
          {payments.length === 0 && (
            <p className="m-0 text-color-text-muted text-sm">No payments in this period</p>
          )}
        </div>
      </div>
    </div>
  );
}
