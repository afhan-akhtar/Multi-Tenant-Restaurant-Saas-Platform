import { auth } from "@/lib/auth";
import { platformPrisma } from "@/lib/platform-db";
import { getRevenueByTenantFromOrders } from "@/lib/cross-tenant-aggregates";
import { redirect } from "next/navigation";
import CommissionClient from "@/app/components/CommissionClient";

export const dynamic = "force-dynamic";

export default async function CommissionPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const [plans, subscriptions, revenueByTenant] = await Promise.all([
    platformPrisma.subscriptionPlan.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { tenantSubscriptions: true } } },
    }),
    platformPrisma.tenantSubscription.findMany({
      where: { status: "ACTIVE" },
      include: { tenant: true, plan: true },
      orderBy: { startDate: "desc" },
    }),
    getRevenueByTenantFromOrders(),
  ]);

  const tenantIds = [...new Set(subscriptions.map((s) => s.tenantId))];
  const tenants = await platformPrisma.tenant.findMany({
    where: { id: { in: tenantIds } },
    select: { id: true, name: true, subdomain: true },
  });
  const tenantMap = Object.fromEntries(tenants.map((t) => [t.id, t]));

  const data = {
    plans: plans.map((p) => ({
      id: p.id,
      name: p.name,
      monthlyPrice: Number(p.monthlyPrice),
      commissionPercent: Number(p.commissionPercent),
      subscriptionCount: p._count.tenantSubscriptions,
    })),
    subscriptions: subscriptions.map((s) => ({
      id: s.id,
      tenantId: s.tenantId,
      tenantName: s.tenant?.name,
      subdomain: s.tenant?.subdomain,
      planName: s.plan?.name,
      commissionPercent: Number(s.plan?.commissionPercent || 0),
      startDate: s.startDate,
      endDate: s.endDate,
      revenue: revenueByTenant[s.tenantId]?.revenue ?? 0,
      orderCount: revenueByTenant[s.tenantId]?.orderCount ?? 0,
    })),
  };

  const totalRevenue = Object.values(revenueByTenant).reduce((s, r) => s + r.revenue, 0);
  const totalCommission = data.subscriptions.reduce((s, sub) => {
    return s + (sub.revenue * sub.commissionPercent) / 100;
  }, 0);

  return (
    <CommissionClient
      data={data}
      totals={{ revenue: totalRevenue, commission: totalCommission }}
    />
  );
}
