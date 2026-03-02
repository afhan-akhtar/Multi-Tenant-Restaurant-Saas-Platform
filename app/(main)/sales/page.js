import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SalesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const orders = await prisma.order.findMany({
    where,
    include: { customer: true, branch: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Sales</h2>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Order #</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Total</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{o.orderNumber}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{o.customer?.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ padding: "0.2rem 0.5rem", borderRadius: 6, background: "#f1f5f9", fontSize: "0.8rem" }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 600 }}>
                  Rs {Number(o.grandTotal).toLocaleString()}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#718096" }}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No sales found</div>
        )}
      </div>
    </div>
  );
}
