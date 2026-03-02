import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import Dashboard from "@/app/components/Dashboard";

export default async function HomePage() {
  const session = await auth();
  const tenantId = session?.user?.tenantId ?? null;
  const data = await getDashboardData(tenantId);

  return <Dashboard data={data} />;
}
