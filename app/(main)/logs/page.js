import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function LogsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const logs = await prisma.auditLog.findMany({
    include: { staff: true, tenant: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Global Logs</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Tenant</th>
                <th>Entity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td>{l.staff?.name || l.actorId}</td>
                  <td>{l.action}</td>
                  <td>{l.tenant?.name || "—"}</td>
                  <td>
                    {l.entityType}#{l.entityId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && <div className={pageStyles.emptyState}>No audit logs</div>}
      </div>
    </div>
  );
}
