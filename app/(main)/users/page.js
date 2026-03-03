import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const isSuperAdmin = session.user?.type === "super_admin";

  let staff = [];
  if (tenantId) {
    staff = await prisma.staff.findMany({
      where: { tenantId },
      include: { role: true, branch: true },
      orderBy: { name: "asc" },
    });
  } else if (isSuperAdmin) {
    staff = await prisma.staff.findMany({
      include: { role: true, branch: true, tenant: true },
      orderBy: { name: "asc" },
      take: 50,
    });
  }

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <h2 className={pageStyles.pageTitle}>User Management</h2>
      </div>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {isSuperAdmin && <th>Tenant</th>}
                <th data-align="center">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.role?.name}</td>
                  {isSuperAdmin && <td>{s.tenant?.name}</td>}
                  <td data-align="center">
                    <span
                      className={tableStyles.badge}
                      style={{
                        background: s.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color: s.status === "ACTIVE" ? "#166534" : "#991b1b",
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff.length === 0 && <div className={pageStyles.emptyState}>No users found</div>}
      </div>
    </div>
  );
}
