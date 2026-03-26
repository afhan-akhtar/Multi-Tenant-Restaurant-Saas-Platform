import KDS from "@/app/components/KDS";
import { createDeviceSocketTicket, validateDeviceAccess } from "@/lib/device-auth";
import { getKDSOrders } from "@/lib/kds";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AccessDenied() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold">KDS access denied</h1>
        <p className="text-sm text-slate-300">
          This device token is missing, invalid, or not linked to the requested tenant.
        </p>
      </div>
    </div>
  );
}

export default async function DeviceKDSPage({ params, searchParams }) {
  const tenantId = Number.parseInt(params?.tenantId, 10);
  const token = String(searchParams?.token || "").trim();

  if (!tenantId || !token) {
    return <AccessDenied />;
  }

  const device = await validateDeviceAccess({
    tenantId,
    token,
    deviceType: "KDS",
  });

  if (!device) {
    return <AccessDenied />;
  }

  const orders = await getKDSOrders(device.tenantId, device.branchId, device.screenId ?? null);
  const wsTicket = createDeviceSocketTicket({
    tenantId: device.tenantId,
    branchId: device.branchId,
    screenId: device.screenId ?? null,
    deviceType: "KDS",
  });

  return (
    <KDS
      data={{ orders }}
      mode="device"
      deviceAuth={{
        tenantId: device.tenantId,
        token,
        deviceType: "KDS",
        screenId: device.screenId ?? null,
        wsTicket,
      }}
    />
  );
}
