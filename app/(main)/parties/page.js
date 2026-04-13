import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { redirect } from "next/navigation";
import CustomersManagement from "@/app/components/CustomersManagement";

export const dynamic = "force-dynamic";

export default async function PartiesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p className="text-color-text-muted">Restaurant context required.</p>
      </div>
    );
  }

  const prisma = await getTenantPrisma(tenantId);
  const customers = await prisma.customer.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });

  return <CustomersManagement customers={customers} />;
}
