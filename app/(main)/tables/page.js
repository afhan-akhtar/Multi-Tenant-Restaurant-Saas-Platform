import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function TablesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className={pageStyles.page}><p>Restaurant context required.</p></div>;

  const tables = await prisma.diningTable.findMany({
    where: { tenantId },
    include: { branch: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Floor & Tables</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Table</th>
                <th>Branch</th>
                <th data-align="right">Seats</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.branch?.name}</td>
                  <td data-align="right">{t.seats}</td>
                  <td>
                    <span
                      className={tableStyles.badge}
                      style={{
                        background: t.status === "AVAILABLE" ? "#dcfce7" : t.status === "OCCUPIED" ? "#fef3c7" : "#e0e7ff",
                        color: t.status === "AVAILABLE" ? "#166534" : t.status === "OCCUPIED" ? "#92400e" : "#3730a3",
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tables.length === 0 && <div className={pageStyles.emptyState}>No tables defined</div>}
      </div>
    </div>
  );
}
