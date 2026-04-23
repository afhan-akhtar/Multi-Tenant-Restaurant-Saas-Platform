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
    // Public marketing home on / for both the root host and tenant subdomains
    // (middleware rewrites e.g. demo.localhost/ → the same (main) route as /).
    if (pathOnly === "/") {
      return <>{children}</>;
    }
    redirect("/login");
  }

  if (session.user?.type === "super_admin") {
    redirect("/admin");
  }

  // Restaurant staff should not have a session here (host-only cookie).
  // If they somehow do (stale cookie), send them to the subdomain login page.
  // Redirecting to the subdomain dashboard would loop (no cookie there).
  const subdomain = session.user?.subdomain;
  if (subdomain) {
    redirect(buildTenantUrl({ host, protocol, subdomain, pathname: "/login" }));
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
