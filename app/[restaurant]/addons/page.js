import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { redirect } from "next/navigation";
import AddonsManagement from "@/app/components/AddonsManagement";

export const dynamic = "force-dynamic";

export default async function AddonsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const prisma = await getTenantPrisma(tenantId);

  const addonGroups = await prisma.addonGroup.findMany({
    where: { tenantId },
    include: { _count: { select: { addonItems: true } } },
    orderBy: { name: "asc" },
  });

  return <AddonsManagement addonGroups={addonGroups} />;
}
