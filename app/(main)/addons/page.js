import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AddonsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const addonGroups = await prisma.addonGroup.findMany({
    where: { tenantId },
    include: { _count: { select: { addonItems: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Add-on Groups</h2>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Min</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Max</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Items</th>
              </tr>
            </thead>
            <tbody>
              {addonGroups.map((g) => (
                <tr key={g.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{g.name}</td>
                  <td className="py-3 px-4" data-align="right">{g.minSelect}</td>
                  <td className="py-3 px-4" data-align="right">{g.maxSelect}</td>
                  <td className="py-3 px-4" data-align="right">{g._count.addonItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {addonGroups.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No add-on groups yet</div>
        )}
      </div>
    </div>
  );
}
