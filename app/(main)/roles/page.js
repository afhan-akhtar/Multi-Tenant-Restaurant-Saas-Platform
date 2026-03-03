import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function RolesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className={pageStyles.page}><p>Restaurant context required.</p></div>;

  const roles = await prisma.role.findMany({
    where: { tenantId },
    include: { _count: { select: { staff: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Roles & Permissions</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Role</th>
                <th data-align="right">Staff Assigned</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td data-align="right">{r._count.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {roles.length === 0 && <div className={pageStyles.emptyState}>No roles defined</div>}
      </div>
    </div>
  );
}
