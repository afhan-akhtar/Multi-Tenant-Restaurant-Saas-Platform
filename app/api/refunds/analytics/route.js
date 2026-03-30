import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRefundAnalytics } from "@/lib/refunds/service";

export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posAccess = await assertTenantFeatureAccess(actor.tenantId, "POS");
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    const { searchParams } = new URL(request.url);
    const analytics = await getRefundAnalytics({
      tenantId: actor.tenantId,
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("[refund analytics error]", error);
    return NextResponse.json({ error: error.message || "Failed to load refund analytics" }, { status: 500 });
  }
}
