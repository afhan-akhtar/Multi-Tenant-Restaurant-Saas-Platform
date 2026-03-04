import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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
      redirect("/go");
    }
  }

  return <LoginForm />;
}
