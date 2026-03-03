import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CommissionPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/");

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-2">Commission & Billing</h2>
      <p className="text-color-text-muted mt-2 text-[0.95rem]">
        Commission logic based on order volume/value. Configure per plan and generate invoices. Coming soon.
      </p>
    </div>
  );
}
