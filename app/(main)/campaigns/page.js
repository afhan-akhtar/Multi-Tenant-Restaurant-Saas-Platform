import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function CampaignsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className={pageStyles.page}><p>Restaurant context required.</p></div>;

  const campaigns = await prisma.emailCampaign.findMany({
    where: { tenantId },
    orderBy: { scheduledAt: "desc" },
    take: 20,
  });

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Email Campaigns</h2>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td>{c.subject}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {new Date(c.scheduledAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {campaigns.length === 0 && <div className={pageStyles.emptyState}>No email campaigns</div>}
      </div>
    </div>
  );
}
