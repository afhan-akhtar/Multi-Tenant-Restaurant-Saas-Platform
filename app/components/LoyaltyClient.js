"use client";

import { useState, useEffect } from "react";
import { formatEur } from "@/lib/currencyFormat";

const DEFAULT_CONFIG = {
  pointsPerEuro: 1,
  redemptionRate: 100,
  tier1Threshold: 500,
  tier2Threshold: 1000,
};

export default function LoyaltyClient({ customers, totalPoints }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  useEffect(() => {
    try {
      const s = localStorage.getItem("loyalty_config");
      if (s) setConfig((c) => ({ ...c, ...JSON.parse(s) }));
    } catch (_) {}
  }, []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      localStorage.setItem("loyalty_config", JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const topByPoints = customers.slice(0, 10);
  const topBySpend = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Loyalty Program</h2>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Total Points Issued</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{totalPoints.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Members</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{customers.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Avg Points / Member</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">
            {customers.length > 0 ? Math.round(totalPoints / customers.length) : 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">
            Top by Points
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Customer</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Points</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Spent</th>
                </tr>
              </thead>
              <tbody>
                {topByPoints.map((c) => (
                  <tr key={c.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4 text-right font-medium">{c.loyaltyPoints}</td>
                    <td className="py-2 px-4 text-right">{formatEur(c.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topByPoints.length === 0 && (
            <div className="py-8 text-center text-color-text-muted text-sm">No loyalty data yet</div>
          )}
        </div>

        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">
            Top by Spend
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Customer</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Orders</th>
                  <th className="py-2 px-4 text-right font-semibold text-color-text">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topBySpend.map((c) => (
                  <tr key={c.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4 text-right">{c.orderCount}</td>
                    <td className="py-2 px-4 text-right font-medium">{formatEur(c.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topBySpend.length === 0 && (
            <div className="py-8 text-center text-color-text-muted text-sm">No loyalty data yet</div>
          )}
        </div>
      </div>

      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">
          Loyalty Rules (Preview)
        </h3>
        <form onSubmit={handleSaveConfig} className="p-4">
          <p className="text-color-text-muted text-sm mb-4">
            Configure how points are earned and redeemed. Changes will apply to future orders.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-color-text-muted mb-1">Points per €1 spent</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={config.pointsPerEuro}
                onChange={(e) => setConfig({ ...config, pointsPerEuro: parseFloat(e.target.value) || 0 })}
                className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-color-text-muted mb-1">Points for €1 discount</label>
              <input
                type="number"
                min="0"
                value={config.redemptionRate}
                onChange={(e) => setConfig({ ...config, redemptionRate: parseInt(e.target.value, 10) || 0 })}
                className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-color-text-muted mb-1">Silver threshold (points)</label>
              <input
                type="number"
                min="0"
                value={config.tier1Threshold}
                onChange={(e) => setConfig({ ...config, tier1Threshold: parseInt(e.target.value, 10) || 0 })}
                className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-color-text-muted mb-1">Gold threshold (points)</label>
              <input
                type="number"
                min="0"
                value={config.tier2Threshold}
                onChange={(e) => setConfig({ ...config, tier2Threshold: parseInt(e.target.value, 10) || 0 })}
                className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Rules"}
            </button>
            {saved && (
              <span className="text-sm text-green-600">Saved to browser</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
