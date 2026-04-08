import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRequestActor, resolveDeviceStaffId } from "@/lib/device-auth";
import { createDineInOrder } from "@/lib/dine-in-order";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = actor.tenantId;
    const branchId = actor.branchId ?? null;

    const featureAccess = await assertTenantFeatureAccess(tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const staffId = await resolveDeviceStaffId(tenantId, branchId);
    if (!staffId) {
      return NextResponse.json({ error: "No staff available to assign this table order." }, { status: 400 });
    }

    const { items, orderType, tableId, customerId, orderNumber: clientOrderNumber } = await request.json();

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
    console.error("[tablet order]", err);
    const message = err?.message || "Failed to create order";
    const status = message.includes("required") || message.includes("not found") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
