import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardLayout from "@/app/components/DashboardLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RestaurantLayout({ children, params }) {
  const headersList = await headers();
  const isLoginPage = headersList.get("x-restaurant-login") === "1";

  if (isLoginPage) {
    return children;
  }

  const session = await auth();
  const restaurant = params?.restaurant || "";

  if (!session) {
    redirect(`/${restaurant}/login`);
  }

  if (session.user?.type === "super_admin") {
    redirect("/admin");
  }

  const subdomain = session.user?.subdomain || "";
  if (subdomain && restaurant !== subdomain) {
    redirect(`/${subdomain}`);
  }

  if (!subdomain) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={session.user} basePath={`/${restaurant}`}>
      {children}
    </DashboardLayout>
  );
}
