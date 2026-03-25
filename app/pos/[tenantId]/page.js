import POS from "@/app/components/POS";
import { validateDeviceAccess } from "@/lib/device-auth";
import { getPOSData } from "@/lib/pos";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AccessDenied() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold">POS access denied</h1>
        <p className="text-sm text-slate-300">
          This device token is missing, invalid, or not linked to the requested tenant.
        </p>
      </div>
    </div>
  );
}

export default async function DevicePOSPage({ params, searchParams }) {
  const tenantId = Number.parseInt(params?.tenantId, 10);
  const token = String(searchParams?.token || "").trim();

  if (!tenantId || !token) {
    return <AccessDenied />;
  }

  const device = await validateDeviceAccess({
    tenantId,
    token,
    deviceType: "POS",
  });

  if (!device) {
    return <AccessDenied />;
  }

  const data = await getPOSData(device.tenantId, device.branchId);

  return (
    <POS
      data={data}
      deviceAuth={{
        tenantId: device.tenantId,
        token,
        deviceType: "POS",
      }}
    />
  );
}
