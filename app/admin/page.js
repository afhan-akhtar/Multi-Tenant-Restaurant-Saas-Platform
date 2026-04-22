import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSuperAdminDashboardData } from "@/lib/dashboard";
import SuperAdminDashboard from "@/app/components/SuperAdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user?.type !== "super_admin") {
    redirect("/login?callbackUrl=/admin");
  }

  const data = await getSuperAdminDashboardData();

  return <SuperAdminDashboard data={data} />;
}
