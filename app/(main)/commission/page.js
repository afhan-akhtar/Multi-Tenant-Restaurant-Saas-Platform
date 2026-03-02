import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CommissionPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Commission & Billing</h2>
      <p style={{ color: "#718096", marginTop: "0.5rem" }}>
        Commission logic based on order volume/value. Configure per plan and generate invoices. Coming soon.
      </p>
    </div>
  );
}
