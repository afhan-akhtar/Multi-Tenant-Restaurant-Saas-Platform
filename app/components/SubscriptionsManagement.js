"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Eur = (n) => `€${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

export default function SubscriptionsManagement({ plans, subscriptions, tenants, basePath = "" }) {
  const router = useRouter();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [planForm, setPlanForm] = useState({ name: "", monthlyPrice: "", commissionPercent: "" });
  const [subForm, setSubForm] = useState({ tenantId: "", planId: "" });

  async function handleCreatePlan(e) {
    e.preventDefault();
    setError("");
    setLoading("plan");
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: planForm.name.trim(),
          monthlyPrice: Number(planForm.monthlyPrice),
          commissionPercent: Number(planForm.commissionPercent),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create plan");
        return;
      }
      setPlanModalOpen(false);
      setPlanForm({ name: "", monthlyPrice: "", commissionPercent: "" });
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleAssignSubscription(e) {
    e.preventDefault();
    setError("");
    setLoading("sub");
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: Number(subForm.tenantId),
          planId: Number(subForm.planId),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to assign subscription");
        return;
      }
      setSubModalOpen(false);
      setSubForm({ tenantId: "", planId: "" });
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  const tenantsWithoutSub = tenants.filter(
    (t) => !subscriptions.some((s) => s.tenantId === t.id && s.status === "ACTIVE")
  );

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Subscriptions & Plans</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold m-0 text-color-text">Plans</h3>
          <button
            type="button"
            onClick={() => { setPlanModalOpen(true); setError(""); }}
            className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
          >
            Add Plan
          </button>
        </div>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[400px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text" data-align="right">Monthly Price</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text" data-align="right">Commission %</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text" data-align="right">Subscriptions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4" data-align="right">{Eur(p.monthlyPrice ?? p.monthlyPrice)}</td>
                    <td className="py-3 px-4" data-align="right">{Number(p.commissionPercent ?? p.commissionPercent)}%</td>
                    <td className="py-3 px-4" data-align="right">{p._count?.tenantSubscriptions ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plans.length === 0 && (
            <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No plans defined. Add a plan to get started.</div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold m-0 text-color-text">Subscriptions</h3>
          {tenantsWithoutSub.length > 0 && plans.length > 0 && (
            <button
              type="button"
              onClick={() => { setSubModalOpen(true); setError(""); setSubForm({ tenantId: tenantsWithoutSub[0]?.id || "", planId: plans[0]?.id || "" }); }}
              className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
            >
              Assign to Restaurant
            </button>
          )}
        </div>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Restaurant</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Plan</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Period</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">{s.tenant?.name} ({s.tenant?.subdomain})</td>
                    <td className="py-3 px-4">{s.plan?.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                        style={{
                          background: s.status === "ACTIVE" ? "#dcfce7" : s.status === "EXPIRED" ? "#fee2e2" : "#f1f5f9",
                          color: s.status === "ACTIVE" ? "#166534" : s.status === "EXPIRED" ? "#991b1b" : "#64748b",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-color-text-muted">
                      {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subscriptions.length === 0 && (
            <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No subscriptions. Assign a plan to active restaurants.</div>
          )}
        </div>
      </div>

      {planModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Add Subscription Plan</h3>
            <form onSubmit={handleCreatePlan}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Plan name</label>
                <input
                  type="text"
                  required
                  placeholder="Starter"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Monthly price (€)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="99"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={planForm.monthlyPrice}
                  onChange={(e) => setPlanForm((f) => ({ ...f, monthlyPrice: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Commission %</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="5"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={planForm.commissionPercent}
                  onChange={(e) => setPlanForm((f) => ({ ...f, commissionPercent: e.target.value }))}
                />
              </div>
              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setPlanModalOpen(false)} className="py-2 px-4 border border-color-border rounded-lg text-color-text bg-transparent cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={loading === "plan"} className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 cursor-pointer disabled:opacity-70">
                  {loading === "plan" ? "Creating…" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Assign Plan to Restaurant</h3>
            <form onSubmit={handleAssignSubscription}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Restaurant</label>
                <select
                  required
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={subForm.tenantId}
                  onChange={(e) => setSubForm((f) => ({ ...f, tenantId: e.target.value }))}
                >
                  <option value="">Select restaurant</option>
                  {tenantsWithoutSub.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.subdomain})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Plan</label>
                <select
                  required
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={subForm.planId}
                  onChange={(e) => setSubForm((f) => ({ ...f, planId: e.target.value }))}
                >
                  <option value="">Select plan</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} – {Eur(p.monthlyPrice)}/mo</option>
                  ))}
                </select>
              </div>
              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setSubModalOpen(false)} className="py-2 px-4 border border-color-border rounded-lg text-color-text bg-transparent cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={loading === "sub"} className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 cursor-pointer disabled:opacity-70">
                  {loading === "sub" ? "Assigning…" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
