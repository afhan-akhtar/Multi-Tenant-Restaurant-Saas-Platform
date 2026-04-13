"use client";

import { useState } from "react";

export default function ImpersonationClient({ staff }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  async function handleImpersonate(tenantId, staffId) {
    setError("");
    setLoading(`${tenantId}-${staffId}`);
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, staffId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Impersonation failed");
        setLoading(null);
        return;
      }

      window.location.assign(data.redirectUrl || "/");
    } catch (err) {
      setError("Something went wrong");
      setLoading(null);
    }
  }

  function staffKey(s) {
    return `${s.tenantId}-${s.id}`;
  }

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-4">Impersonation</h2>
      <p className="text-color-text-muted mb-4 text-sm">
        Log in as any Tenant Admin for support or debugging. Secure capability for Super Admin only.
      </p>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Tenant Admin</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Restaurant</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Role</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={staffKey(s)} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{s.name} ({s.email})</td>
                  <td className="py-3 px-4">{s.tenant?.name} ({s.tenant?.subdomain})</td>
                  <td className="py-3 px-4">{s.role?.name}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleImpersonate(s.tenantId, s.id)}
                      disabled={loading === staffKey(s)}
                      className="py-1.5 px-3 bg-primary text-white rounded-md text-xs font-medium border-0 cursor-pointer hover:opacity-90 disabled:opacity-70"
                    >
                      {loading === staffKey(s) ? "Logging in…" : "Impersonate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No tenant admins found</div>
        )}
      </div>
    </div>
  );
}
