import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardLayout from "@/app/components/DashboardLayout";
import { getTenantSubscriptionAccess } from "@/lib/subscriptions";
import { buildRootUrl } from "@/lib/tenant-url";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isExternalTenantLoginPath(pathHeader) {
  const p = (pathHeader || "").split("?")[0] || "";
  return p === "/login" || p.endsWith("/login");
}

export default async function RestaurantLayout({ children, params }) {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const pathFromMiddleware = headersList.get("x-pathname") || "";

  const session = await auth();
  const restaurant = params?.restaurant || "";

  // /login is served under this layout but must stay public: middleware rewrites
  // e.g. demo.localhost…/login → /{tenant}/login; without this check, we redirect
  // to the landing page before the login form ever renders.
  if (!session && isExternalTenantLoginPath(pathFromMiddleware)) {
    return <>{children}</>;
  }

  if (!session) {
    redirect(buildRootUrl({ host, protocol, pathname: "/" }));
  }

  if (session.user?.type === "super_admin") {
    redirect(buildRootUrl({ host, protocol, pathname: "/admin" }));
  }

  const subdomain = session.user?.subdomain || "";
  if (subdomain && restaurant !== subdomain) {
    redirect("/");
  }

  if (!subdomain) {
    redirect("/login");
  }

  const subscriptionAccess = await getTenantSubscriptionAccess(session.user.tenantId);

  return (
    <DashboardLayout
      user={session.user}
      basePath=""
      subscriptionAccess={subscriptionAccess}
    >
      {children}
    </DashboardLayout>
  );
}
