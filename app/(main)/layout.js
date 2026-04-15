import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { platformPrisma } from "@/lib/platform-db";
import DashboardLayout from "@/app/components/DashboardLayout";
import { buildTenantUrl, getHostInfo } from "@/lib/tenant-url";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MainLayout({ children }) {
  const session = await auth();
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const pathRaw = headersList.get("x-pathname") || "/";
  const pathOnly = pathRaw.split("?")[0] || "/";
  const { isTenantHost } = getHostInfo(host);

  if (!session) {
    if (pathOnly === "/" && !isTenantHost) {
      return <>{children}</>;
    }
    redirect("/login");
  }

  if (session.user?.type === "super_admin") {
    redirect("/admin");
  }

  // Restaurant staff: dashboard lives at /{subdomain}, redirect there
  const subdomain = session.user?.subdomain;
  if (subdomain) {
    redirect(buildTenantUrl({ host, protocol, subdomain, pathname: "/" }));
  }

  let pendingTenantCount = 0;
  if (session.user?.type === "super_admin") {
    pendingTenantCount = await platformPrisma.tenant.count({ where: { status: "PENDING" } });
  }

  return (
    <DashboardLayout user={session.user} pendingTenantCount={pendingTenantCount}>
      {children}
    </DashboardLayout>
  );
}
