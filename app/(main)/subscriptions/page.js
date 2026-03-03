import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

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
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Subscriptions & Plans</h2>

      <div className={pageStyles.pageSection}>
        <h3 className={pageStyles.pageSectionTitle}>Plans</h3>
        <div className={pageStyles.card}>
          <div className={tableStyles.tableWrapper}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th data-align="right">Monthly Price</th>
                  <th data-align="right">Commission %</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td data-align="right">€{Number(p.monthlyPrice).toLocaleString()}</td>
                    <td data-align="right">{Number(p.commissionPercent)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plans.length === 0 && <div className={pageStyles.emptyState}>No plans defined</div>}
        </div>
      </div>

      <div className={pageStyles.pageSection}>
        <h3 className={pageStyles.pageSectionTitle}>Active Subscriptions</h3>
        <div className={pageStyles.card}>
          <div className={tableStyles.tableWrapper}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.tenant?.name}</td>
                    <td>{s.plan?.name}</td>
                    <td>
                      <span
                        className={tableStyles.badge}
                        style={{
                          background: s.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                          color: s.status === "ACTIVE" ? "#166534" : "#991b1b",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--color-text-muted)" }}>
                      {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subscriptions.length === 0 && <div className={pageStyles.emptyState}>No subscriptions</div>}
        </div>
      </div>
    </div>
  );
}
