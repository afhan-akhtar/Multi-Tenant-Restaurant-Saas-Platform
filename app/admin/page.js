import { auth } from "@/lib/auth";
import { getSuperAdminDashboardData } from "@/lib/dashboard";
import SuperAdminDashboard from "@/app/components/SuperAdminDashboard";
import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user?.type !== "super_admin") {
    return <AdminLoginForm />;
  }

  const data = await getSuperAdminDashboardData();

  return <SuperAdminDashboard data={data} />;
}
