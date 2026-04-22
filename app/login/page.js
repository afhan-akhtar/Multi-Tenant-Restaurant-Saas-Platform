import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buildTenantUrl } from "@/lib/tenant-url";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Restaurant Admin login – redirect if already logged in */
export default async function LoginPage() {
  const session = await auth();

  if (session) {
    if (session.user?.type === "super_admin") {
      redirect("/admin");
    }
    if (session.user?.subdomain) {
      // Don't redirect to /go — that causes a loop because demo.localhost has
      // no session cookie (host-only at localhost).  Send them to the subdomain
      // login page; auth() there returns null so the form renders cleanly.
      const headersList = await headers();
      const host = headersList.get("host") || "localhost:3000";
      const protocol = headersList.get("x-forwarded-proto") || "http";
      redirect(buildTenantUrl({ host, protocol, subdomain: session.user.subdomain, pathname: "/login" }));
    }
  }

  return <LoginForm />;
}
