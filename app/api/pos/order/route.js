import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRequestActor } from "@/lib/device-auth";
import { createDineInOrder } from "@/lib/dine-in-order";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, orderType, tableId, customerId, orderNumber: clientOrderNumber } = await request.json();
    const tenantId = actor.tenantId ?? null;
    const branchId = actor.branchId ?? null;
    const staffId = actor.staffId ?? null;

    if (!tenantId || !branchId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    if (!staffId) {
      return NextResponse.json({ error: "No active staff member is linked to this POS device." }, { status: 400 });
    }

    const featureAccess = await assertTenantFeatureAccess(tenantId, "POS");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const { order, orderNumber, kdsOrder } = await createDineInOrder({
      tenantId,
      branchId,
      staffId,
      items,
      orderType,
      tableId,
      customerId,
      clientOrderNumber,
      lineItemStatus: "OPEN",
    });

    return NextResponse.json({ order, orderNumber, kdsOrder });
  } catch (err) {
    console.error("[POS order error]", err);
    const message = err?.message || "Failed to create order";
    const status = message.includes("required") || message.includes("not found") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
