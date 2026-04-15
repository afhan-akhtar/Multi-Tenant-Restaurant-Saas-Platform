import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { platformPrisma } from "@/lib/platform-db";
import { createQrPaymentIntent } from "@/lib/payments/stripe";
import { assertStripeConfigured } from "@/lib/payments/config";
import { computeQrCheckoutTotals } from "@/lib/qr-order";
import { getTenantPrisma } from "@/lib/tenant-db";

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
    const checkoutSessionIdRaw = typeof body.checkout_session_id === "string" ? body.checkout_session_id.trim() : "";

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

    const posAccess = await assertTenantFeatureAccess(tenantId, "POS");
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    const payAccess = await assertTenantFeatureAccess(tenantId, "ONLINE_PAYMENTS");
    if (!payAccess.ok) {
      return NextResponse.json({ error: payAccess.error }, { status: payAccess.status });
    }

    try {
      assertStripeConfigured();
    } catch (e) {
      return NextResponse.json({ error: e.message || "Stripe is not configured" }, { status: 503 });
    }

    if (items.length > 50) {
      return NextResponse.json({ error: "Too many line items" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantId);
    const table = await prisma.diningTable.findFirst({
      where: { tenantId, id: tableId },
    });
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const { grandTotal } = await computeQrCheckoutTotals(tenantId, items);

    const checkoutSessionId =
      checkoutSessionIdRaw.length >= 8
        ? checkoutSessionIdRaw.slice(0, 128)
        : `qr-${tenantId}-${tableId}-${Date.now()}`;

    const intent = await createQrPaymentIntent({
      amount: grandTotal,
      tenantId,
      branchId: table.branchId,
      tableId: table.id,
      checkoutSessionId,
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      checkoutSessionId,
      amount: grandTotal,
    });
  } catch (err) {
    console.error("[qr-order payment-intent]", err);
    const message = err?.message || "Failed to create payment";
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
