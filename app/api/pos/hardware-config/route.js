import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { publicPosHardwareSettings } from "@/lib/pos-hardware/settings";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS", "TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const tenant = await prisma.tenant.findUnique({
      where: { id: actor.tenantId },
      select: { posHardwareSettings: true },
    });

    return NextResponse.json(publicPosHardwareSettings(tenant?.posHardwareSettings));
  } catch (e) {
    console.error("[pos/hardware-config]", e);
    return NextResponse.json({ error: "Failed to load hardware config" }, { status: 500 });
  }
}
