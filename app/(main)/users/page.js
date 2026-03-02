import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const isSuperAdmin = session.user?.type === "super_admin";

  let staff = [];
  if (tenantId) {
    staff = await prisma.staff.findMany({
      where: { tenantId },
      include: { role: true, branch: true },
      orderBy: { name: "asc" },
    });
  } else if (isSuperAdmin) {
    staff = await prisma.staff.findMany({
      include: { role: true, branch: true, tenant: true },
      orderBy: { name: "asc" },
      take: 50,
    });
  }

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>User Management</h2>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Email</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Role</th>
              {isSuperAdmin && <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Tenant</th>}
              <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{s.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{s.email}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{s.role?.name}</td>
                {isSuperAdmin && <td style={{ padding: "0.75rem 1rem" }}>{s.tenant?.name}</td>}
                <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: s.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                      color: s.status === "ACTIVE" ? "#166534" : "#991b1b",
                      fontSize: "0.8rem",
                    }}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No users found</div>
        )}
      </div>
    </div>
  );
}
