import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function RolesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div style={{ padding: "2rem" }}><p>Restaurant context required.</p></div>;

  const roles = await prisma.role.findMany({
    where: { tenantId },
    include: { _count: { select: { staff: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Roles & Permissions</h2>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Role</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Staff Assigned</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{r.name}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{r._count.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {roles.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No roles defined</div>
        )}
      </div>
    </div>
  );
}
