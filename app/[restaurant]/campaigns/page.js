import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { redirect } from "next/navigation";

export default async function CampaignsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const prisma = await getTenantPrisma(tenantId);

  const campaigns = await prisma.emailCampaign.findMany({
    where: { tenantId },
    orderBy: { scheduledAt: "desc" },
    take: 20,
  });

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Email Campaigns</h2>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Subject</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{c.subject}</td>
                  <td className="py-3 px-4 text-color-text-muted">
                    {new Date(c.scheduledAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {campaigns.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No email campaigns</div>
        )}
      </div>
    </div>
  );
}
