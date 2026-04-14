import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getTabletWaiterFromRequest, assertWaiterStaff } from "@/lib/tablet-waiter";

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

    const current = await assertWaiterStaff(actor.tenantId, actor.branchId, waiter.staffId);
    if (!current) {
      return NextResponse.json({ error: "Invalid waiter" }, { status: 403 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const prisma = await getTenantPrisma(actor.tenantId);

    const body = await request.json();
    const sessionId = Number(body?.sessionId);
    const newWaiterId = Number(body?.newWaiterId);
    if (!sessionId || !newWaiterId) {
      return NextResponse.json({ error: "sessionId and newWaiterId required" }, { status: 400 });
    }

    const nextWaiter = await assertWaiterStaff(actor.tenantId, actor.branchId, newWaiterId);
    if (!nextWaiter) {
      return NextResponse.json({ error: "Target must be an active waiter in this branch" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        tenantId: actor.tenantId,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
        closedAt: null,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { waiterId: newWaiterId },
    });

    return NextResponse.json({ success: true, sessionId });
  } catch (err) {
    console.error("[tablet transfer waiter]", err);
    return NextResponse.json({ error: err.message || "Transfer failed" }, { status: 500 });
  }
}
