import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Post-login redirect: Super Admin → /admin, Restaurant Admin → /{subdomain} */
export default async function GoPage() {
  const session = await auth();

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

  redirect(`/${subdomain}`);
}
