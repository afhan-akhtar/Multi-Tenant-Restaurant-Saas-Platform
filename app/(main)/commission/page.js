import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";

export default async function CommissionPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Commission & Billing</h2>
      <p className={pageStyles.pageDescription}>
        Commission logic based on order volume/value. Configure per plan and generate invoices. Coming soon.
      </p>
    </div>
  );
}
