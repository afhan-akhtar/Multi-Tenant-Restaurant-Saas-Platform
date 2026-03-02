import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Products</h2>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Category</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>PLU</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Price</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{p.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{p.category?.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{p.plu}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 600 }}>
                  Rs {Number(p.basePrice).toLocaleString()}
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: p.isActive ? "#dcfce7" : "#fee2e2",
                      color: p.isActive ? "#166534" : "#991b1b",
                      fontSize: "0.8rem",
                    }}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No products found</div>
        )}
      </div>
    </div>
  );
}
