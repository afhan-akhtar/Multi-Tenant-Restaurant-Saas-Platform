import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import Dashboard from "@/app/components/Dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RestaurantDashboardPage() {
  const session = await auth();
  const tenantId = session?.user?.tenantId ?? null;

  const data = await getDashboardData(tenantId, "staff");
  return <Dashboard data={data} />;
}
