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
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Products</h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              transition: "box-shadow 0.2s",
            }}
          >
            <div
              style={{
                aspectRatio: "1",
                background: "#f1f5f9",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                  }}
                >
                  🍽
                </div>
              )}
            </div>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>{p.name}</div>
              <div style={{ fontSize: "0.85rem", color: "#718096", marginBottom: "0.5rem" }}>{p.category?.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "#e94560" }}>€{Number(p.basePrice).toLocaleString()}</span>
                <span
                  style={{
                    padding: "0.2rem 0.5rem",
                    borderRadius: 6,
                    background: p.isActive ? "#dcfce7" : "#fee2e2",
                    color: p.isActive ? "#166534" : "#991b1b",
                    fontSize: "0.75rem",
                  }}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No products found</div>
      )}
    </div>
  );
}
