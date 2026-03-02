import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TablesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div style={{ padding: "2rem" }}><p>Restaurant context required.</p></div>;

  const tables = await prisma.diningTable.findMany({
    where: { tenantId },
    include: { branch: true },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Floor & Tables</h2>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Table</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Branch</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Seats</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{t.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{t.branch?.name}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{t.seats}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: t.status === "AVAILABLE" ? "#dcfce7" : t.status === "OCCUPIED" ? "#fef3c7" : "#e0e7ff",
                      color: t.status === "AVAILABLE" ? "#166534" : t.status === "OCCUPIED" ? "#92400e" : "#3730a3",
                      fontSize: "0.8rem",
                    }}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tables.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No tables defined</div>
        )}
      </div>
    </div>
  );
}
