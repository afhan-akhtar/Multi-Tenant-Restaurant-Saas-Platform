import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CommissionClient from "@/app/components/CommissionClient";

export const dynamic = "force-dynamic";

export default async function CommissionPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const [plans, subscriptions, tenantRevenue] = await Promise.all([
    prisma.subscriptionPlan.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { tenantSubscriptions: true } } },
    }),
    prisma.tenantSubscription.findMany({
      where: { status: "ACTIVE" },
      include: { tenant: true, plan: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.order.groupBy({
      by: ["tenantId"],
      where: { status: "COMPLETED" },
      _sum: { grandTotal: true },
      _count: true,
    }),
  ]);

  const revenueByTenant = {};
  tenantRevenue.forEach((r) => {
    revenueByTenant[r.tenantId] = {
      revenue: Number(r._sum.grandTotal || 0),
      orderCount: r._count,
    };
  });

  const tenantIds = [...new Set(subscriptions.map((s) => s.tenantId))];
  const tenants = await prisma.tenant.findMany({
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
