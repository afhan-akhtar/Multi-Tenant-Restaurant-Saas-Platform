import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function RestaurantsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const tenants = await prisma.tenant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true, staff: true } } },
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Restaurant Management</h2>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Subdomain</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Orders</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Staff</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{t.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{t.subdomain}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: t.status === "ACTIVE" ? "#dcfce7" : t.status === "BLOCKED" ? "#fee2e2" : "#f1f5f9",
                      color: t.status === "ACTIVE" ? "#166534" : t.status === "BLOCKED" ? "#991b1b" : "#64748b",
                      fontSize: "0.8rem",
                    }}
                  >
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{t._count.orders}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{t._count.staff}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ color: "#718096", fontSize: "0.85rem" }}>Block / Unblock (coming soon)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No restaurants yet</div>
        )}
      </div>
    </div>
  );
}
