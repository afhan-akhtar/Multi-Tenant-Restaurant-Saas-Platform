import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import {
  assertWaiterStaff,
  findWaiterStaffForBranch,
  signTabletWaiterSession,
  verifyTenantTabletPin,
} from "@/lib/tablet-waiter";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const body = await request.json();
    const pin = String(body?.pin || "").trim();
    const staffIdBody = body?.staffId != null ? Number(body.staffId) : null;

    const pinCheck = await verifyTenantTabletPin(actor.tenantId, pin);
    if (!pinCheck.ok) {
      return NextResponse.json({ error: pinCheck.error }, { status: 401 });
    }

    let staffId = staffIdBody;
    if (!staffId) {
      const waiters = await findWaiterStaffForBranch(actor.tenantId, actor.branchId);
      if (!waiters.length) {
        return NextResponse.json(
          { error: "No waiter role staff found. Create a staff member with a Waiter role." },
          { status: 400 }
        );
      }
      staffId = waiters[0].id;
    }

    const staff = await assertWaiterStaff(actor.tenantId, actor.branchId, staffId);
    if (!staff) {
      return NextResponse.json({ error: "Invalid waiter for this branch." }, { status: 403 });
    }

    const sessionToken = signTabletWaiterSession({
      tenantId: actor.tenantId,
      staffId: staff.id,
    });

    return NextResponse.json({
      sessionToken,
      staff: { id: staff.id, name: staff.name },
      expiresInHours: 12,
    });
  } catch (err) {
    console.error("[tablet waiter unlock]", err);
    return NextResponse.json({ error: "Unlock failed" }, { status: 500 });
  }
}
