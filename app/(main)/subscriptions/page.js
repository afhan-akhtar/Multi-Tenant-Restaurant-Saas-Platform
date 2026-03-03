import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const [plans, subscriptions] = await Promise.all([
    prisma.subscriptionPlan.findMany({ orderBy: { name: "asc" } }),
    prisma.tenantSubscription.findMany({
      include: { tenant: true, plan: true },
      orderBy: { startDate: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Subscriptions & Plans</h2>

      <div className="mb-8 last:mb-0">
        <h3 className="text-base font-semibold mb-4 text-color-text">Plans</h3>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto overflow-y-hidden">
            <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Monthly Price</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Commission %</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4" data-align="right">€{Number(p.monthlyPrice).toLocaleString()}</td>
                    <td className="py-3 px-4" data-align="right">{Number(p.commissionPercent)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plans.length === 0 && (
            <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No plans defined</div>
          )}
        </div>
      </div>

      <div className="mb-8 last:mb-0">
        <h3 className="text-base font-semibold mb-4 text-color-text">Active Subscriptions</h3>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto overflow-y-hidden">
            <table className="w-full border-collapse text-sm min-w-[600px]">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Restaurant</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Plan</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Period</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">{s.tenant?.name}</td>
                    <td className="py-3 px-4">{s.plan?.name}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-color-text-muted">
                      {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subscriptions.length === 0 && (
            <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No subscriptions</div>
          )}
        </div>
      </div>
    </div>
  );
}
