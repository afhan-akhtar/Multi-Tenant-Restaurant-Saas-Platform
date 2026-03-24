import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DashboardLayout from "@/app/components/DashboardLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session || session.user?.type !== "super_admin") {
    return <>{children}</>;
  }

  const pendingTenantCount = await prisma.tenant.count({ where: { status: "PENDING" } });

  return (
    <DashboardLayout user={session.user} pendingTenantCount={pendingTenantCount} basePath="/admin">
      {children}
    </DashboardLayout>
  );
}
