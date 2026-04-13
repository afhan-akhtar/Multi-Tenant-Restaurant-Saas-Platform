import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getTenantsWithOperationalCounts } from "@/lib/tenant-list-with-counts";
import { redirect } from "next/navigation";
import RestaurantsManagement from "@/app/components/RestaurantsManagement";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const tenants = await getTenantsWithOperationalCounts();

  return (
    <Suspense fallback={<div className="py-8 text-color-text-muted">Loading…</div>}>
      <RestaurantsManagement tenants={tenants} />
    </Suspense>
  );
}
