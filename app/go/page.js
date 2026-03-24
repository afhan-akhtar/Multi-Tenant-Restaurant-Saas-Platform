import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buildTenantUrl } from "@/lib/tenant-url";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Post-login redirect: Super Admin → /admin, Restaurant Admin → tenant subdomain */
export default async function GoPage() {
  const session = await auth();
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";

  if (!session) {
    redirect("/login");
  }

  if (session.user?.type === "super_admin") {
    redirect("/admin");
  }

  const subdomain = session.user?.subdomain;
  if (!subdomain) {
    redirect("/login");
  }

  redirect(buildTenantUrl({ host, protocol, subdomain, pathname: "/" }));
}
