import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ImpersonationPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const staff = await prisma.staff.findMany({
    include: { tenant: true, role: true },
    orderBy: { name: "asc" },
    take: 50,
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Impersonation</h2>
      <p style={{ color: "#718096", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Log in as any restaurant staff for support or debugging. Secure capability for Super Admin only.
      </p>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Staff</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Restaurant</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Role</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{s.name} ({s.email})</td>
                <td style={{ padding: "0.75rem 1rem" }}>{s.tenant?.name} ({s.tenant?.subdomain})</td>
                <td style={{ padding: "0.75rem 1rem" }}>{s.role?.name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ color: "#718096", fontSize: "0.85rem" }}>Impersonate (coming soon)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#718096" }}>No staff found</div>
        )}
      </div>
    </div>
  );
}
