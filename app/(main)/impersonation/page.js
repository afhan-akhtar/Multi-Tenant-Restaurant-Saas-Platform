import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function ImpersonationPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const staff = await prisma.staff.findMany({
    include: { tenant: true, role: true },
    orderBy: { name: "asc" },
    take: 50,
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Impersonation</h2>
      <p className={pageStyles.pageDescriptionBlock}>
        Log in as any restaurant staff for support or debugging. Secure capability for Super Admin only.
      </p>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Restaurant</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.name} ({s.email})</td>
                  <td>{s.tenant?.name} ({s.tenant?.subdomain})</td>
                  <td>{s.role?.name}</td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Impersonate (coming soon)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff.length === 0 && <div className={pageStyles.emptyState}>No staff found</div>}
      </div>
    </div>
  );
}
