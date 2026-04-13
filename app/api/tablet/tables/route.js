import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const tables = await prisma.diningTable.findMany({
      where: {
        tenantId: actor.tenantId,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
      },
      orderBy: { name: "asc" },
    });

    const openSessions = await prisma.session.findMany({
      where: {
        tenantId: actor.tenantId,
        closedAt: null,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
      },
      select: {
        id: true,
        tableId: true,
        waiterId: true,
        openedAt: true,
      },
    });

    const sessionByTable = new Map(openSessions.map((s) => [s.tableId, s]));

    return NextResponse.json({
      tables: tables.map((t) => ({
        id: t.id,
        name: t.name,
        seats: t.seats,
        status: t.status,
        session: sessionByTable.get(t.id) ?? null,
      })),
    });
  } catch (err) {
    console.error("[tablet tables]", err);
    return NextResponse.json({ error: "Failed to load tables" }, { status: 500 });
  }
}
