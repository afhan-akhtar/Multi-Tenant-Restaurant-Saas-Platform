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
    <div className="py-4 w-full min-w-0">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="m-0 text-xl font-semibold text-color-text">User Management</h2>
      </div>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right [&_th[data-align=center]]:text-center [&_td[data-align=center]]:text-center">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Email</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Role</th>
                {isSuperAdmin && <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Tenant</th>}
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="center">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{s.name}</td>
                  <td className="py-3 px-4">{s.email}</td>
                  <td className="py-3 px-4">{s.role?.name}</td>
                  {isSuperAdmin && <td className="py-3 px-4">{s.tenant?.name}</td>}
                  <td className="py-3 px-4" data-align="center">
                    <span
                      className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                      style={{
                        background: s.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color: s.status === "ACTIVE" ? "#166534" : "#991b1b",
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No users found</div>
        )}
      </div>
    </div>
  );
}
