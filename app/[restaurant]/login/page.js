import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RestaurantLoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Restaurant-specific login – redirect if already logged in */
export default async function RestaurantLoginPage({ params }) {
  const session = await auth();
  const restaurant = params?.restaurant || "";

  if (session) {
    if (session.user?.type === "super_admin") {
      redirect("/admin");
    }
    if (session.user?.subdomain) {
      if (session.user.subdomain === restaurant) {
        redirect(`/${restaurant}`);
      }
      redirect("/go");
    }
  }

  return <RestaurantLoginForm />;
}
