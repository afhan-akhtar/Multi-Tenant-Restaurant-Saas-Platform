"use client";

import { useMemo, useState } from "react";

export default function GlobalLogsClient({ logs }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((l) => {
      const actor = String(l.tenantAdmin?.name || l.actorId || "").toLowerCase();
      const action = String(l.action || "").toLowerCase();
      const tenant = String(l.tenant?.name || "").toLowerCase();
      const entity = `${l.entityType} ${l.entityId}`.toLowerCase();
      return actor.includes(q) || action.includes(q) || tenant.includes(q) || entity.includes(q);
    });
  }, [logs, query]);

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-2">Global Logs</h2>
      <p className="text-color-text-muted text-sm mb-4 max-w-3xl">
        Read-only merge of per-tenant audit trails (critical actions such as refunds and permission-sensitive
        operations). For compliance, plan on <strong>90 days</strong> online retention and archive older exports
        offline. Shipping to ElasticSearch or CloudWatch can mirror the same stream from your log pipeline; this UI
        reads directly from tenant databases.
      </p>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actor, action, tenant, entity…"
          className="w-full sm:max-w-md py-2 px-3 rounded-lg border border-color-border bg-color-card text-color-text text-sm"
          aria-label="Filter logs"
        />
        <span className="text-xs text-color-text-muted">
          Showing {filtered.length} of {logs.length} loaded
        </span>
      </div>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Actor</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Action</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Tenant</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Entity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l._tenantKey} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-color-text-muted">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{l.tenantAdmin?.name || l.actorId}</td>
                  <td className="py-3 px-4">{l.action}</td>
                  <td className="py-3 px-4">{l.tenant?.name || "—"}</td>
                  <td className="py-3 px-4">
                    {l.entityType} #{l.entityId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">
            {logs.length === 0 ? "No audit logs yet" : "No matches for this search"}
          </div>
        )}
      </div>
    </div>
  );
}
