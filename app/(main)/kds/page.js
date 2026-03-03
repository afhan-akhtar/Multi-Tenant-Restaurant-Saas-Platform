import { auth } from "@/lib/auth";
import { getKDSOrders } from "@/lib/kds";
import { redirect } from "next/navigation";
import KDS from "@/app/components/KDS";

export default async function KDSPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const branchId = session.user?.branchId ?? null;

  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p className="text-color-text-muted">Restaurant context required. Log in as Restaurant Admin.</p>
      </div>
    );
  }

  const orders = await getKDSOrders(tenantId, branchId);

  return <KDS data={{ orders }} />;
}
