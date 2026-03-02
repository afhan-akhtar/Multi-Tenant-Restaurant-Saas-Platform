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
    <div style={{ padding: "1rem 0" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Subscriptions & Plans</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Plans</h3>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Monthly Price</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Commission %</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.name}</td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                    €{Number(p.monthlyPrice).toLocaleString()}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{Number(p.commissionPercent)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {plans.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>No plans defined</div>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Active Subscriptions</h3>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Restaurant</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Plan</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Period</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{s.tenant?.name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{s.plan?.name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
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
                  <td style={{ padding: "0.75rem 1rem", color: "#718096" }}>
                    {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscriptions.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>No subscriptions</div>
          )}
        </div>
      </div>
    </div>
  );
}
