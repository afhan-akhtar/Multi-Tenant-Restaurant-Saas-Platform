import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getTabletWaiterFromRequest, assertWaiterStaff } from "@/lib/tablet-waiter";

/**
 * Minimal same-day sales summary for waiter (no admin analytics).
 */
export async function GET(request) {
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

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        tenantId: actor.tenantId,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
        createdAt: { gte: start },
        status: { notIn: ["CANCELLED"] },
      },
      select: {
        grandTotal: true,
        status: true,
      },
    });

    const gross = orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0);
    const completed = orders.filter((o) => o.status === "COMPLETED").length;

    return NextResponse.json({
      date: start.toISOString().slice(0, 10),
      orderCount: orders.length,
      completedCount: completed,
      grossSales: Math.round(gross * 100) / 100,
    });
  } catch (err) {
    console.error("[tablet reports summary]", err);
    return NextResponse.json({ error: "Failed to load summary" }, { status: 500 });
  }
}
