import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import RestaurantsManagement from "@/app/components/RestaurantsManagement";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const tenants = await prisma.tenant.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
    include: { _count: { select: { orders: true, staff: true } } },
  });

  return (
    <Suspense fallback={<div className="py-8 text-color-text-muted">Loading…</div>}>
      <RestaurantsManagement tenants={tenants} />
    </Suspense>
  );
}
