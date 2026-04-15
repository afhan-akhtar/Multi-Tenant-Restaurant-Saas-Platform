import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { platformPrisma } from "@/lib/platform-db";
import { createQrTableOrder } from "@/lib/qr-order";
import { isStripeConfigured } from "@/lib/payments/config";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 48_000;

export async function POST(request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const tenantId = body.tenant_id != null ? Number(body.tenant_id) : null;
    const tableId = body.table_id != null ? Number(body.table_id) : null;
    const items = Array.isArray(body.items) ? body.items : null;
    const customerName = typeof body.customer_name === "string" ? body.customer_name : "";
    const notes = typeof body.notes === "string" ? body.notes : "";

    if (!tenantId || !tableId || !items?.length) {
      return NextResponse.json({ error: "tenant_id, table_id, and items are required" }, { status: 400 });
    }

    const platformTenant = await platformPrisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, status: true },
    });
    if (!platformTenant || platformTenant.status !== "ACTIVE") {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const featureAccess = await assertTenantFeatureAccess(tenantId, "POS");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const onlinePay = await assertTenantFeatureAccess(tenantId, "ONLINE_PAYMENTS");
    const mustPayOnline = onlinePay.ok && isStripeConfigured();

    const paymentIntentId = String(body.payment_intent_id || body?.stripe?.payment_intent_id || "").trim();
    const checkoutSessionId = String(body.checkout_session_id || body?.stripe?.checkout_session_id || "").trim();

    let stripePayment = null;
    if (mustPayOnline) {
      if (!paymentIntentId || !checkoutSessionId) {
        return NextResponse.json(
          { error: "Card payment is required before your order is sent to the kitchen." },
          { status: 400 }
        );
      }
      stripePayment = { paymentIntentId, checkoutSessionId };
    }

    if (items.length > 50) {
      return NextResponse.json({ error: "Too many line items" }, { status: 400 });
    }

    const result = await createQrTableOrder({
      tenantId,
      tableId,
      items,
      customerName,
      notes,
      stripePayment,
    });

    const { order, orderNumber, qrClientToken, idempotentReplay } = result;

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber,
      qrClientToken,
      status: order.status,
      grandTotal: Number(order.grandTotal),
      ...(idempotentReplay ? { idempotentReplay: true } : {}),
    });
  } catch (err) {
    console.error("[qr-order]", err);
    const message = err?.message || "Failed to place order";
    const status =
      message.includes("not found") ||
      message.includes("required") ||
      message.includes("not available") ||
      message.includes("Invalid")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
