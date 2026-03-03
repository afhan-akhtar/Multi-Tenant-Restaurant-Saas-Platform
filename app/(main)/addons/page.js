import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function AddonsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className={pageStyles.page}><p>Restaurant context required.</p></div>;

  const addonGroups = await prisma.addonGroup.findMany({
    where: { tenantId },
    include: { _count: { select: { addonItems: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Add-on Groups</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th data-align="right">Min</th>
                <th data-align="right">Max</th>
                <th data-align="right">Items</th>
              </tr>
            </thead>
            <tbody>
              {addonGroups.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td data-align="right">{g.minSelect}</td>
                  <td data-align="right">{g.maxSelect}</td>
                  <td data-align="right">{g._count.addonItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {addonGroups.length === 0 && <div className={pageStyles.emptyState}>No add-on groups yet</div>}
      </div>
    </div>
  );
}
