import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Profile</h2>
      <div className={pageStyles.contentCard}>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>Type:</strong> {session.user?.type}</p>
        {session.user?.tenantName && <p><strong>Tenant:</strong> {session.user.tenantName}</p>}
      </div>
    </div>
  );
}
