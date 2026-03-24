import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardLayout from "@/app/components/DashboardLayout";
import { getTenantSubscriptionAccess } from "@/lib/subscriptions";
import { buildRootUrl } from "@/lib/tenant-url";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RestaurantLayout({ children, params }) {
  const headersList = await headers();
  const isLoginPage = headersList.get("x-restaurant-login") === "1";
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";

  if (isLoginPage) {
    return children;
  }

  const session = await auth();
  const restaurant = params?.restaurant || "";

  if (!session) {
    redirect("/login");
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
