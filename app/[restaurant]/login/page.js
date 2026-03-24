import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RestaurantLoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Restaurant-specific login – redirect if already logged in */
export default async function RestaurantLoginPage({ searchParams }) {
  const session = await auth();
  const forceLogin = searchParams?.forceLogin === "1";

  if (session && !forceLogin) {
    if (session.user?.type === "super_admin") {
      redirect("/admin");
    }
    if (session.user?.subdomain) {
      redirect("/");
    }
  }

  return <RestaurantLoginForm />;
}
