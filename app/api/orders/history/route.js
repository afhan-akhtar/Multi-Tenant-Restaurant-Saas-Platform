import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRefundOrderHistory } from "@/lib/refunds/service";

export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS", "KDS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posAccess = await assertTenantFeatureAccess(actor.tenantId, "POS");
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    const { searchParams } = new URL(request.url);
    const orders = await getRefundOrderHistory({
      tenantId: actor.tenantId,
      branchId: actor.branchId ?? null,
      search: searchParams.get("search") || "",
      limit: searchParams.get("limit") || 20,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[order history error]", error);
    return NextResponse.json({ error: error.message || "Failed to load order history" }, { status: 500 });
  }
}
