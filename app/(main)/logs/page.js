import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function LogsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const logs = await prisma.auditLog.findMany({
    include: { staff: true, tenant: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Global Logs</h2>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Date</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Actor</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Action</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Tenant</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Entity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#718096" }}>
                  {new Date(l.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>{l.staff?.name || l.actorId}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{l.action}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{l.tenant?.name || "—"}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  {l.entityType}#{l.entityId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No audit logs</div>
        )}
      </div>
    </div>
  );
}
