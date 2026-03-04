import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DashboardLayout from "@/app/components/DashboardLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MainLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user?.type === "super_admin") {
    redirect("/admin");
  }

  // Restaurant staff: dashboard lives at /{subdomain}, redirect there
  const subdomain = session.user?.subdomain;
  if (subdomain) {
    redirect(`/${subdomain}`);
  }

  let pendingTenantCount = 0;
  if (session.user?.type === "super_admin") {
    pendingTenantCount = await prisma.tenant.count({ where: { status: "PENDING" } });
  }

  return (
    <DashboardLayout user={session.user} pendingTenantCount={pendingTenantCount}>
      {children}
    </DashboardLayout>
  );
}
