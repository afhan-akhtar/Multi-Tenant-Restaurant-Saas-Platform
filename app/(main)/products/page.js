import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import gridStyles from "@/app/styles/Grid.module.css";

export default async function ProductsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <h2 className={pageStyles.pageTitle}>Products</h2>
      </div>
      <div className={gridStyles.grid}>
        {products.map((p) => (
          <div key={p.id} className={gridStyles.gridCard}>
            <div className={gridStyles.gridCardImage}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} />
              ) : (
                <div className={gridStyles.gridCardPlaceholder}>🍽</div>
              )}
            </div>
            <div className={gridStyles.gridCardBody}>
              <div className={gridStyles.gridCardTitle}>{p.name}</div>
              <div className={gridStyles.gridCardSubtitle}>{p.category?.name}</div>
              <div className={gridStyles.gridCardFooter}>
                <span className={gridStyles.gridCardPrice}>€{Number(p.basePrice).toLocaleString()}</span>
                <span
                  className={gridStyles.gridBadge}
                  style={{
                    background: p.isActive ? "#dcfce7" : "#fee2e2",
                    color: p.isActive ? "#166534" : "#991b1b",
                  }}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && <div className={pageStyles.emptyState}>No products found</div>}
    </div>
  );
}
