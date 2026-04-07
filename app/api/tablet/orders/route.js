import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getKDSOrderById } from "@/lib/kds";

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

    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get("tableId") ? Number(searchParams.get("tableId")) : null;

    const orders = await prisma.order.findMany({
      where: {
        tenantId: actor.tenantId,
        ...(actor.branchId ? { branchId: actor.branchId } : {}),
        ...(tableId ? { tableId } : {}),
        status: { notIn: ["COMPLETED", "CANCELLED", "REFUNDED"] },
      },
      include: {
        orderItems: true,
        table: { select: { id: true, name: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const withKds = await Promise.all(
      orders.map(async (o) => {
        const kds = await getKDSOrderById(actor.tenantId, o.id);
        return { ...o, kdsOrder: kds };
      })
    );

    return NextResponse.json({ orders: withKds });
  } catch (err) {
    console.error("[tablet orders list]", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
