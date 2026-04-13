import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { redirect } from "next/navigation";
import TablesManagement from "@/app/components/TablesManagement";

export const dynamic = "force-dynamic";

export default async function TablesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const prisma = await getTenantPrisma(tenantId);

  const [tables, branches] = await Promise.all([
    prisma.diningTable.findMany({
      where: { tenantId },
      include: { branch: true },
      orderBy: { name: "asc" },
    }),
    prisma.branch.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
    }),
  ]);

  return <TablesManagement tables={tables} branches={branches} />;
}
