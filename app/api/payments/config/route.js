import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getPublicPaymentConfig } from "@/lib/payments/config";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(getPublicPaymentConfig());
  } catch (error) {
    console.error("[payments config]", error);
    return NextResponse.json({ error: "Failed to load payment settings." }, { status: 500 });
  }
}
