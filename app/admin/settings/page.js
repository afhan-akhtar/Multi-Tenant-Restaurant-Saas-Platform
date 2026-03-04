import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/app/components/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

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
