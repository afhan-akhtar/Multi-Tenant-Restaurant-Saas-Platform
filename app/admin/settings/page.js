import { auth } from "@/lib/auth";
import { platformPrisma } from "@/lib/platform-db";
import { redirect } from "next/navigation";
import SettingsClient from "@/app/components/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  const [tenantsCount, plansCount] = await Promise.all([
    platformPrisma.tenant.count(),
    platformPrisma.subscriptionPlan.count(),
  ]);

  return (
    <SettingsClient
      type="platform"
      platform={{ tenantsCount, plansCount }}
    />
  );
}
