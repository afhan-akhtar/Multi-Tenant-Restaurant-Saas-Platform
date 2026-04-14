import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getTabletWaiterFromRequest, assertWaiterStaff } from "@/lib/tablet-waiter";

/**
 * Moves open sessions (and their orders) from sourceTableId onto targetTableId (same branch).
 */
export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const waiter = await getTabletWaiterFromRequest(request);
    if (!waiter || waiter.tenantId !== actor.tenantId) {
      return NextResponse.json({ error: "Waiter session required" }, { status: 403 });
    }

    const staff = await assertWaiterStaff(actor.tenantId, actor.branchId, waiter.staffId);
    if (!staff) {
      return NextResponse.json({ error: "Invalid waiter" }, { status: 403 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const prisma = await getTenantPrisma(actor.tenantId);

    const body = await request.json();
    const fromTableId = Number(body?.fromTableId);
    const toTableId = Number(body?.toTableId);
    if (!fromTableId || !toTableId || fromTableId === toTableId) {
      return NextResponse.json({ error: "fromTableId and toTableId required" }, { status: 400 });
    }

    const [fromTable, toTable] = await Promise.all([
      prisma.diningTable.findFirst({
        where: {
          id: fromTableId,
          tenantId: actor.tenantId,
          ...(actor.branchId ? { branchId: actor.branchId } : {}),
        },
      }),
      prisma.diningTable.findFirst({
        where: {
          id: toTableId,
          tenantId: actor.tenantId,
          ...(actor.branchId ? { branchId: actor.branchId } : {}),
        },
      }),
    ]);

    if (!fromTable || !toTable) {
      return NextResponse.json({ error: "Tables not found in this branch" }, { status: 404 });
    }

    const openSessions = await prisma.session.findMany({
      where: {
        tenantId: actor.tenantId,
        tableId: fromTableId,
        closedAt: null,
      },
      select: { id: true },
    });

    const sessionIds = openSessions.map((s) => s.id);

    if (sessionIds.length === 0) {
      return NextResponse.json({ error: "No active session on source table" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.session.updateMany({
        where: { id: { in: sessionIds } },
        data: { tableId: toTableId },
      }),
      prisma.order.updateMany({
        where: { sessionId: { in: sessionIds } },
        data: { tableId: toTableId },
      }),
      prisma.diningTable.update({
        where: { id: fromTableId },
        data: { status: "AVAILABLE" },
      }),
      prisma.diningTable.update({
        where: { id: toTableId },
        data: { status: "OCCUPIED" },
      }),
    ]);

    return NextResponse.json({ success: true, mergedIntoTableId: toTableId, sessionsMoved: sessionIds.length });
  } catch (err) {
    console.error("[tablet tables merge]", err);
    return NextResponse.json({ error: err.message || "Merge failed" }, { status: 500 });
  }
}
