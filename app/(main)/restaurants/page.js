import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function RestaurantsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const tenants = await prisma.tenant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true, staff: true } } },
  });

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Restaurant Management</h2>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Subdomain</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Orders</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Staff</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{t.name}</td>
                  <td className="py-3 px-4">{t.subdomain}</td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                      style={{
                        background: t.status === "ACTIVE" ? "#dcfce7" : t.status === "BLOCKED" ? "#fee2e2" : "#f1f5f9",
                        color: t.status === "ACTIVE" ? "#166534" : t.status === "BLOCKED" ? "#991b1b" : "#64748b",
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4" data-align="right">{t._count.orders}</td>
                  <td className="py-3 px-4" data-align="right">{t._count.staff}</td>
                  <td className="py-3 px-4 text-color-text-muted text-[0.85rem]">Block / Unblock (coming soon)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tenants.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No restaurants yet</div>
        )}
      </div>
    </div>
  );
}
