import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function RolesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const roles = await prisma.role.findMany({
    where: { tenantId },
    include: { _count: { select: { staff: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Roles & Permissions</h2>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Role</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Tenant Admins Assigned</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{r.name}</td>
                  <td className="py-3 px-4" data-align="right">{r._count.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {roles.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No roles defined</div>
        )}
      </div>
    </div>
  );
}
