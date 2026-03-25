import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getKDSOrders } from "@/lib/kds";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["KDS"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getKDSOrders(actor.tenantId, actor.branchId);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[kds live]", error);
    return NextResponse.json({ error: "Failed to load live KDS orders" }, { status: 500 });
  }
}
