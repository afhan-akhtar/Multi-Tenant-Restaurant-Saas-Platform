import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getPOSData } from "@/lib/pos";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";

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

    const data = await getPOSData(actor.tenantId, actor.branchId);
    if (!data) {
      return NextResponse.json({ error: "Menu unavailable" }, { status: 404 });
    }

    return NextResponse.json({
      categories: data.categories,
      products: data.products,
      addonGroups: data.addonGroups,
      tables: data.tables,
      customers: data.customers,
      loyaltyEnabled: data.loyaltyEnabled,
      loyaltySettings: data.loyaltySettings,
      subscription: data.subscription,
    });
  } catch (err) {
    console.error("[tablet menu]", err);
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}
