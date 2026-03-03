import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className={pageStyles.page}><p>Restaurant context required.</p></div>;

  const categories = await prisma.category.findMany({
    where: { tenantId },
    include: { _count: { select: { products: true } }, parent: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Categories</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent</th>
                <th data-align="right">Products</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{c.parent?.name || "—"}</td>
                  <td data-align="right">{c._count.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && <div className={pageStyles.emptyState}>No categories yet</div>}
      </div>
    </div>
  );
}
