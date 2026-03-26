import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DevicesManagement from "@/app/components/DevicesManagement";
import {
  getTenantBranches,
  getTenantDeviceTokens,
  getTenantKdsScreens,
  serializeDeviceToken,
  serializeKdsScreen,
} from "@/lib/devices";

export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p>Restaurant context required.</p>
      </div>
    );
  }

  const [devices, branches, screens] = await Promise.all([
    getTenantDeviceTokens(tenantId),
    getTenantBranches(tenantId),
    getTenantKdsScreens(tenantId),
  ]);

  return (
    <DevicesManagement
      devices={devices.map(serializeDeviceToken)}
      branches={branches.map((branch) => ({ id: branch.id, name: branch.name }))}
      screens={screens.map(serializeKdsScreen)}
    />
  );
}
