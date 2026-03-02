import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardLayout from "@/app/components/DashboardLayout";

export default async function MainLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={session.user}>
      {children}
    </DashboardLayout>
  );
}
