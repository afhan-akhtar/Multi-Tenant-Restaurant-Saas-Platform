import { auth } from "@/lib/auth";
import { listAllTenantAdmins } from "@/lib/tenant-staff-list";
import { redirect } from "next/navigation";

export default async function ImpersonationPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const staff = (await listAllTenantAdmins()).slice(0, 50);

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-4">Impersonation</h2>
      <p className="text-color-text-muted mb-4 text-sm">
        Log in as any Tenant Admin for support or debugging. Secure capability for Super Admin only.
      </p>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right [&_th[data-align=center]]:text-center [&_td[data-align=center]]:text-center">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Tenant Admin</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Restaurant</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Role</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={`${s.tenantId}-${s.id}`} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{s.name} ({s.email})</td>
                  <td className="py-3 px-4">{s.tenant?.name} ({s.tenant?.subdomain})</td>
                  <td className="py-3 px-4">{s.role?.name}</td>
                  <td className="py-3 px-4 text-color-text-muted text-[0.85rem]">Impersonate (coming soon)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No tenant admins found</div>
        )}
      </div>
    </div>
  );
}
