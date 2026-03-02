import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ExpensesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const entries = await prisma.cashbookEntry.findMany({
    where: { ...where, type: { in: ["expense", "sent", "out"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Expenses</h2>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Type</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Amount</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{e.type}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 600, color: "#dc2626" }}>
                  Rs {Number(e.amount).toLocaleString()}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#718096" }}>
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No expenses found</div>
        )}
      </div>
    </div>
  );
}
