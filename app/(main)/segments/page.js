import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function SegmentsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className={pageStyles.page}><p>Restaurant context required.</p></div>;

  const segments = await prisma.segment.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Customer Segments</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {segments.length === 0 && <div className={pageStyles.emptyState}>No segments defined</div>}
      </div>
    </div>
  );
}
