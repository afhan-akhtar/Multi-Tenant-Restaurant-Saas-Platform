import { Suspense } from "react";
import { findTabletDeviceByToken, createDeviceSocketTicket } from "@/lib/device-auth";
import { getPOSData } from "@/lib/pos";
import { prisma } from "@/lib/db";
import TabletApp from "./components/TabletApp";
import TabletAccessRecovery from "./components/TabletAccessRecovery";
import TabletTokenPersister from "./components/TabletTokenPersister";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TabletTokenPage({ searchParams }) {
  const resolvedSearch = await Promise.resolve(searchParams);
  const token = String(resolvedSearch?.token || "").trim();

  if (!token) {
    return <TabletAccessRecovery initialToken="" invalid={false} />;
  }

  const device = await findTabletDeviceByToken(token);

  if (!device) {
    return <TabletAccessRecovery initialToken={token} invalid />;
  }

  const [data, tenantRow] = await Promise.all([
    getPOSData(device.tenantId, device.branchId),
    prisma.tenant.findUnique({
      where: { id: device.tenantId },
      select: { name: true },
    }),
  ]);

  const wsTicket = createDeviceSocketTicket({
    tenantId: device.tenantId,
    branchId: device.branchId,
    screenId: null,
    deviceType: "TABLET",
  });

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <p>Unable to load restaurant data.</p>
      </div>
    );
  }

  return (
    <>
      <TabletTokenPersister token={token} />
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6">
            Loading tablet…
          </div>
        }
      >
        <TabletApp
          data={{ ...data, tenantName: tenantRow?.name || "Restaurant" }}
          deviceAuth={{
            tenantId: device.tenantId,
            token,
            deviceType: "TABLET",
            wsTicket,
          }}
        />
      </Suspense>
    </>
  );
}
