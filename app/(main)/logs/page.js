import { auth } from "@/lib/auth";
import { getMergedAuditLogs } from "@/lib/cross-tenant-aggregates";
import { redirect } from "next/navigation";

export default async function LogsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const logs = await getMergedAuditLogs(100);

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Global Logs</h2>
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
              {logs.map((l) => (
                <tr key={l._tenantKey} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-color-text-muted">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{l.tenantAdmin?.name || l.actorId}</td>
                  <td className="py-3 px-4">{l.action}</td>
                  <td className="py-3 px-4">{l.tenant?.name || "—"}</td>
                  <td className="py-3 px-4">
                    {l.entityType}#{l.entityId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No audit logs</div>
        )}
      </div>
    </div>
  );
}
