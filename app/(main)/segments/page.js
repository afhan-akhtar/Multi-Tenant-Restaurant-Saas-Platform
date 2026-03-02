import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SegmentsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div style={{ padding: "2rem" }}><p>Restaurant context required.</p></div>;

  const segments = await prisma.segment.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Customer Segments</h2>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Name</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{s.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {segments.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No segments defined</div>
        )}
      </div>
    </div>
  );
}
