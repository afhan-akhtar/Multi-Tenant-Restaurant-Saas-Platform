import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { findWaiterStaffForBranch } from "@/lib/tablet-waiter";

export const dynamic = "force-dynamic";

/**
 * Lists waiter-role staff for PIN screen (optional staff picker before unlock).
 */
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

    const waiters = await findWaiterStaffForBranch(actor.tenantId, actor.branchId);
    return NextResponse.json({
      staff: waiters.map((w) => ({ id: w.id, name: w.name })),
    });
  } catch (err) {
    console.error("[tablet waiter staff]", err);
    return NextResponse.json({ error: "Failed to load staff" }, { status: 500 });
  }
}
