import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function RestaurantsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const tenants = await prisma.tenant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true, staff: true } } },
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Restaurant Management</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subdomain</th>
                <th>Status</th>
                <th data-align="right">Orders</th>
                <th data-align="right">Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.subdomain}</td>
                  <td>
                    <span
                      className={tableStyles.badge}
                      style={{
                        background: t.status === "ACTIVE" ? "#dcfce7" : t.status === "BLOCKED" ? "#fee2e2" : "#f1f5f9",
                        color: t.status === "ACTIVE" ? "#166534" : t.status === "BLOCKED" ? "#991b1b" : "#64748b",
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td data-align="right">{t._count.orders}</td>
                  <td data-align="right">{t._count.staff}</td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Block / Unblock (coming soon)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tenants.length === 0 && <div className={pageStyles.emptyState}>No restaurants yet</div>}
      </div>
    </div>
  );
}
