import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SubscriptionsManagement from "@/app/components/SubscriptionsManagement";
import { buildPlanFeatures } from "@/lib/subscriptionPlans";
import { runSubscriptionBillingCycle, serializeSubscription } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  await runSubscriptionBillingCycle(prisma);

  const [plans, subscriptions, tenants, planChangeRequests] = await Promise.all([
    prisma.subscriptionPlan.findMany({
      orderBy: [{ sortOrder: "asc" }, { monthlyPrice: "asc" }],
      include: { _count: { select: { tenantSubscriptions: true } } },
    }),
    prisma.tenantSubscription.findMany({
      include: {
        tenant: true,
        plan: true,
        invoices: {
          include: {
            payments: {
              orderBy: { paidAt: "desc" },
            },
          },
          orderBy: [{ periodEnd: "desc" }, { issuedAt: "desc" }],
        },
      },
      orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
    }),
    prisma.tenant.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, subdomain: true },
    }),
    prisma.subscriptionPlanChangeRequest.findMany({
      include: {
        tenant: { select: { id: true, name: true, subdomain: true } },
        requestedPlan: true,
        currentSubscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <SubscriptionsManagement
      plans={plans.map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        description: plan.description || "",
        monthlyPrice: Number(plan.monthlyPrice),
        commissionPercent: Number(plan.commissionPercent),
        trialDays: Number(plan.trialDays || 0),
        graceDays: Number(plan.graceDays || 0),
        sortOrder: Number(plan.sortOrder || 0),
        features: buildPlanFeatures(plan.features),
        subscriptionCount: plan._count?.tenantSubscriptions ?? 0,
      }))}
      subscriptions={subscriptions.map((subscription) => serializeSubscription(subscription))}
      tenants={tenants}
      planChangeRequests={planChangeRequests.map((request) => ({
        id: request.id,
        tenantId: request.tenantId,
        status: request.status,
        message: request.message || "",
        reviewedNote: request.reviewedNote || "",
        createdAt: request.createdAt,
        reviewedAt: request.reviewedAt,
        tenant: request.tenant,
        requestedPlan: {
          id: request.requestedPlan.id,
          name: request.requestedPlan.name,
        },
        currentPlan: request.currentSubscription?.plan
          ? {
              id: request.currentSubscription.plan.id,
              name: request.currentSubscription.plan.name,
            }
          : null,
      }))}
      basePath="/admin"
    />
  );
}
