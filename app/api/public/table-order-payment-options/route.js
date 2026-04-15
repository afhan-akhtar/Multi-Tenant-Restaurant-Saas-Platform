import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getPaymentCurrency, isStripeConfigured } from "@/lib/payments/config";

export const dynamic = "force-dynamic";

/** Public: whether the guest QR menu must pay by card before the order is sent. */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenant_id") ? Number(searchParams.get("tenant_id")) : null;
    if (!tenantId) {
      return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });
    }

    const platformTenant = await platformPrisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, status: true },
    });
    if (!platformTenant || platformTenant.status !== "ACTIVE") {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const online = await assertTenantFeatureAccess(tenantId, "ONLINE_PAYMENTS");
    const stripeReady = isStripeConfigured();
    const requireOnlinePayment = online.ok && stripeReady;

    return NextResponse.json({
      requireOnlinePayment,
      currency: getPaymentCurrency(),
      stripe: {
        enabled: requireOnlinePayment,
        publishableKey: stripeReady ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null : null,
      },
    });
  } catch (err) {
    console.error("[table-order-payment-options]", err);
    return NextResponse.json({ error: "Failed to load payment options" }, { status: 500 });
  }
}
