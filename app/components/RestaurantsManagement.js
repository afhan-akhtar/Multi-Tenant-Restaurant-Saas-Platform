"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";

const STATUS_STYLES = {
  PENDING: { bg: "#fef3c7", color: "#b45309" },
  ACTIVE: { bg: "#dcfce7", color: "#166534" },
  INACTIVE: { bg: "#f1f5f9", color: "#64748b" },
  BLOCKED: { bg: "#fee2e2", color: "#991b1b" },
};

export default function RestaurantsManagement({ tenants: initialTenants, basePath = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tenants, setTenants] = useState(initialTenants);
  const activeTab = searchParams.get("tab") || "all"; // "pending" | "all"

  useEffect(() => {
    setTenants(initialTenants);
  }, [initialTenants]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(null); // tenant id or "create"
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    restaurantName: "",
    branchName: "",
    subdomain: "",
    country: "",
    ownerName: "",
    email: "",
    password: "",
  });
  const [countryFilter, setCountryFilter] = useState("");

  const filteredTenants = useMemo(() => {
    if (!countryFilter) return tenants;
    return tenants.filter((t) => (t.country || "").toLowerCase() === countryFilter.toLowerCase());
  }, [tenants, countryFilter]);

  const pending = filteredTenants.filter((t) => String(t.status || "").toUpperCase() === "PENDING");
  const active = filteredTenants.filter((t) => t.status === "ACTIVE");
  const blocked = filteredTenants.filter((t) => t.status === "BLOCKED");
  const inactive = filteredTenants.filter((t) => t.status === "INACTIVE");
  const displayTenants = [...pending, ...active, ...blocked, ...inactive];

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading("create");
    try {
      const res = await fetch("/api/super-admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      setModalOpen(false);
      setForm({ restaurantName: "", branchName: "", subdomain: "", country: "", ownerName: "", email: "", password: "" });
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleAction(tenantId, action) {
    setError("");
    setLoading(tenantId);
    try {
      const res = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Action failed");
        return;
      }
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="py-4 w-full min-w-0">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-xl font-semibold text-color-text">Restaurant Management</h2>
          <p className="m-0 mt-1 text-sm text-color-text-muted">
            Onboard, approve, block, or unblock restaurants. Pending registrations require your approval.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="py-2 px-3 border border-color-border rounded-lg bg-color-card text-color-text text-sm"
          >
            <option value="">All countries</option>
            {[...new Set(tenants.map((t) => t.country).filter(Boolean))].sort().map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="py-2 px-3 border border-color-border rounded-lg text-color-text text-sm font-medium hover:bg-color-bg transition-colors"
            title="Refresh to see new registrations"
          >
            ↻ Refresh
          </button>
          <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90 transition-opacity"
        >
          + Add Restaurant
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-color-border">
        <button
          type="button"
          onClick={() => router.push(`${basePath || ""}/restaurants?tab=pending`)}
          className={`py-2.5 px-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "pending"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-color-text-muted hover:text-color-text"
          }`}
        >
          Pending Approval
          {pending.length > 0 && (
            <span className="ml-2 py-0.5 px-2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              {pending.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push(`${basePath || ""}/restaurants?tab=all`)}
          className={`py-2.5 px-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-color-text-muted hover:text-color-text"
          }`}
        >
          All Restaurants
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <h3 className="m-0 mb-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
            Pending Approval ({pending.length})
          </h3>
          <p className="m-0 mb-4 text-xs text-color-text-muted">
            New registrations awaiting your approval. Approve to activate, Reject to block.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-color-border">
                  <th className="py-2 px-3 text-left font-medium text-color-text">Name</th>
                  <th className="py-2 px-3 text-left font-medium text-color-text">Subdomain</th>
                  <th className="py-2 px-3 text-left font-medium text-color-text">Country</th>
                  <th className="py-2 px-3 text-left font-medium text-color-text">Tenant Admins</th>
                  <th className="py-2 px-3 text-right font-medium text-color-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((t) => (
                  <tr key={t.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-3">{t.name}</td>
                    <td className="py-2 px-3">{t.subdomain}</td>
                    <td className="py-2 px-3">{t.country || "—"}</td>
                    <td className="py-2 px-3">{t._count?.staff ?? 0}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleAction(t.id, "approve")}
                        disabled={loading === t.id}
                        className="py-1.5 px-3 mr-2 bg-emerald-600 text-white rounded text-xs font-medium border-0 cursor-pointer hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(t.id, "block")}
                        disabled={loading === t.id}
                        className="py-1.5 px-3 bg-red-600 text-white rounded text-xs font-medium border-0 cursor-pointer hover:bg-red-700 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "pending" && pending.length === 0 && (
        <div className="py-12 text-center bg-color-card rounded-lg border border-color-border">
          <p className="m-0 text-color-text-muted">No pending registrations.</p>
          <p className="m-0 mt-1 text-sm text-color-text-muted">New sign-ups will appear here for approval.</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">{error}</div>
      )}

      {activeTab === "all" && (
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Subdomain</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Country</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Orders</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Tenant Admins</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayTenants.map((t) => {
                const style = STATUS_STYLES[t.status] || STATUS_STYLES.INACTIVE;
                return (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">{t.name}</td>
                    <td className="py-3 px-4">{t.subdomain}</td>
                    <td className="py-3 px-4">{t.country || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4" data-align="right">{t._count?.orders ?? 0}</td>
                    <td className="py-3 px-4" data-align="right">{t._count?.staff ?? 0}</td>
                    <td className="py-3 px-4">
                      {t.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleAction(t.id, "block")}
                          disabled={loading === t.id}
                          className="py-1.5 px-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium border-0 cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-60"
                        >
                          Block
                        </button>
                      )}
                      {t.status === "BLOCKED" && (
                        <button
                          type="button"
                          onClick={() => handleAction(t.id, "unblock")}
                          disabled={loading === t.id}
                          className="py-1.5 px-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-xs font-medium border-0 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 disabled:opacity-60"
                        >
                          Unblock
                        </button>
                      )}
                      {(String(t.status || "").toUpperCase() === "PENDING" || t.status === "INACTIVE") && (
                        <span className="text-color-text-muted text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {displayTenants.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No restaurants yet</div>
        )}
      </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Add Restaurant</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Restaurant name</label>
                <input
                  type="text"
                  required
                  placeholder="My Restaurant"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={form.restaurantName}
                  onChange={(e) => setForm((f) => ({ ...f, restaurantName: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Branch name</label>
                <input
                  type="text"
                  required
                  placeholder="Main Branch"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={form.branchName}
                  onChange={(e) => setForm((f) => ({ ...f, branchName: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Subdomain</label>
                <input
                  type="text"
                  required
                  placeholder="my-restaurant"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={form.subdomain}
                  onChange={(e) => setForm((f) => ({ ...f, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Owner name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={form.ownerName}
                  onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Owner email</label>
                <input
                  type="email"
                  required
                  placeholder="owner@restaurant.com"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-1 text-sm font-medium text-color-text">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setError(""); }}
                  className="py-2 px-4 border border-color-border rounded-lg text-color-text bg-transparent cursor-pointer hover:bg-color-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading === "create"}
                  className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 cursor-pointer disabled:opacity-70"
                >
                  {loading === "create" ? "Creating…" : "Add Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
