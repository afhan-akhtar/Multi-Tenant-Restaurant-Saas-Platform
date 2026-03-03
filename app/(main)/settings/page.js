import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/app/components/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const isSuperAdmin = session.user?.type === "super_admin";

  if (isSuperAdmin) {
    const [tenantsCount, plansCount] = await Promise.all([
      prisma.tenant.count(),
      prisma.subscriptionPlan.count(),
    ]);
    return (
      <SettingsClient
        type="platform"
        platform={{ tenantsCount, plansCount }}
      />
    );
  }

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p className="text-color-text-muted">Restaurant context required.</p>
      </div>
    );
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, name: true, subdomain: true, country: true, status: true },
  });

  return (
    <SettingsClient
      type="tenant"
      tenant={tenant}
    />
  );
}
