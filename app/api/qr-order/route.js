import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { platformPrisma } from "@/lib/platform-db";
import { createQrTableOrder } from "@/lib/qr-order";

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

    if (items.length > 50) {
      return NextResponse.json({ error: "Too many line items" }, { status: 400 });
    }

    const { order, orderNumber, qrClientToken } = await createQrTableOrder({
      tenantId,
      tableId,
      items,
      customerName,
      notes,
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber,
      qrClientToken,
      status: order.status,
      grandTotal: Number(order.grandTotal),
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
