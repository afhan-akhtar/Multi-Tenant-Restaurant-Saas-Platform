import { NextResponse } from "next/server";
import { createStripeTerminalConnectionToken } from "@/lib/payments/stripe";
import { getRequestActor } from "@/lib/device-auth";

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = actor.tenantId ?? null;
    const branchId = actor.branchId ?? null;

    if (!tenantId || !branchId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const connectionToken = await createStripeTerminalConnectionToken();
    return NextResponse.json({ secret: connectionToken.secret });
  } catch (error) {
    console.error("[stripe connection-token]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe Terminal connection token." },
      { status: 500 }
    );
  }
}
