import { auth } from "@/lib/auth";
import { listAllTenantAdmins } from "@/lib/tenant-staff-list";
import { redirect } from "next/navigation";
import ImpersonationClient from "@/app/components/ImpersonationClient";

export const dynamic = "force-dynamic";

export default async function AdminImpersonationPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  const staff = await listAllTenantAdmins();

  return <ImpersonationClient staff={staff} />;
}
