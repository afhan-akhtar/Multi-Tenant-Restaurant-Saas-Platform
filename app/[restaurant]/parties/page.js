import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CustomersManagement from "@/app/components/CustomersManagement";

export const dynamic = "force-dynamic";

export default async function PartiesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return <CustomersManagement customers={customers} />;
}
