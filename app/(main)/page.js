import { auth } from "@/lib/auth";
import { getDashboardData, getSuperAdminDashboardData } from "@/lib/dashboard";
import Dashboard from "@/app/components/Dashboard";
import SuperAdminDashboard from "@/app/components/SuperAdminDashboard";

export default async function HomePage() {
  const session = await auth();
  const isSuperAdmin = session?.user?.type === "super_admin";

  const data = isSuperAdmin
    ? await getSuperAdminDashboardData()
    : await getDashboardData(session?.user?.tenantId ?? null);

  return isSuperAdmin ? <SuperAdminDashboard data={data} /> : <Dashboard data={data} />;
}
