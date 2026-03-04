import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SubscriptionsManagement from "@/app/components/SubscriptionsManagement";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  const [plans, subscriptions, tenants] = await Promise.all([
    prisma.subscriptionPlan.findMany({
      orderBy: { name: "asc" },
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
      plans={plans}
      subscriptions={subscriptions}
      tenants={tenants}
      basePath="/admin"
    />
  );
}
