import { auth } from "@/lib/auth";
import { getKDSOrders } from "@/lib/kds";
import { createDeviceSocketTicket } from "@/lib/device-auth";
import { redirect } from "next/navigation";
import KDS from "@/app/components/KDS";

export const dynamic = "force-dynamic";

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
  const wsTicket = createDeviceSocketTicket({
    tenantId,
    branchId,
    deviceType: "KDS",
  });

  return <KDS data={{ orders }} mode="dashboard" deviceAuth={{ tenantId, branchId, wsTicket }} />;
}
