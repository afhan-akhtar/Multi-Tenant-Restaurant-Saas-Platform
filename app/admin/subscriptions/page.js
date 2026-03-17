import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SubscriptionsManagement from "@/app/components/SubscriptionsManagement";
import { normalizePlanFeatures } from "@/lib/subscriptionPlans";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  const [plans, subscriptions, tenants] = await Promise.all([
    prisma.subscriptionPlan.findMany({
      orderBy: { monthlyPrice: "asc" },
      include: { _count: { select: { tenantSubscriptions: true } } },
    }),
    prisma.tenantSubscription.findMany({
      include: { tenant: true, plan: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.tenant.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, subdomain: true },
    }),
  ]);

  return (
    <SubscriptionsManagement
      plans={plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        monthlyPrice: Number(plan.monthlyPrice),
        commissionPercent: Number(plan.commissionPercent),
        features: normalizePlanFeatures(plan.features),
        subscriptionCount: plan._count?.tenantSubscriptions ?? 0,
      }))}
      subscriptions={subscriptions.map((subscription) => ({
        id: subscription.id,
        tenantId: subscription.tenantId,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        tenant: subscription.tenant
          ? {
              id: subscription.tenant.id,
              name: subscription.tenant.name,
              subdomain: subscription.tenant.subdomain,
            }
          : null,
        plan: subscription.plan
          ? {
              id: subscription.plan.id,
              name: subscription.plan.name,
              monthlyPrice: Number(subscription.plan.monthlyPrice),
              commissionPercent: Number(subscription.plan.commissionPercent),
              features: normalizePlanFeatures(subscription.plan.features),
            }
          : null,
      }))}
      tenants={tenants}
      basePath="/admin"
    />
  );
}
