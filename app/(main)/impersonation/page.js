import { auth } from "@/lib/auth";
import { listAllTenantAdmins } from "@/lib/tenant-staff-list";
import { redirect } from "next/navigation";
import ImpersonationClient from "@/app/components/ImpersonationClient";

export default async function ImpersonationPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  const staff = await listAllTenantAdmins();

  return <ImpersonationClient staff={staff} />;
}
