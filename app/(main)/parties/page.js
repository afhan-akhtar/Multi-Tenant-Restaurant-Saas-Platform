import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function PartiesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Parties (Customers)</h2>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Email</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Loyalty</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{c.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{c.email}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{c.phone}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{c.loyaltyPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No parties found</div>
        )}
      </div>
    </div>
  );
}
