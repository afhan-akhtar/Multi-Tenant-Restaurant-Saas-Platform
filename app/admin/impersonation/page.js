import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ImpersonationClient from "@/app/components/ImpersonationClient";

export const dynamic = "force-dynamic";

export default async function AdminImpersonationPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  const staff = await prisma.tenantAdmin.findMany({
    where: { status: "ACTIVE" },
    include: { tenant: true, role: true },
    orderBy: [{ tenant: { name: "asc" } }, { name: "asc" }],
  });

  return <ImpersonationClient staff={staff} />;
}
