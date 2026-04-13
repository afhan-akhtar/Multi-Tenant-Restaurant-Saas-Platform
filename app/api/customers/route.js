import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import {
  normalizeCustomerPhone,
  isValidCustomerPhoneDigits,
  resolveCustomerName,
  guestEmailForPhone,
} from "@/lib/customerPhone";

export async function POST(req) {
  try {
    const actor = await getRequestActor(req, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = actor.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const body = await req.json();
    const { name, email, phone } = body;
    const phoneDigits = normalizeCustomerPhone(phone);
    if (!isValidCustomerPhoneDigits(phoneDigits)) {
      return NextResponse.json(
        { error: "Valid mobile number is required (7–15 digits)." },
        { status: 400 }
      );
    }

    const duplicate = await prisma.customer.findFirst({
      where: { tenantId, phone: phoneDigits },
    });
    if (duplicate) {
      return NextResponse.json({ error: "This number is already registered." }, { status: 409 });
    }

    const displayName = resolveCustomerName({ name, phoneDigits });
    const emailFinal = String(email || "").trim() || guestEmailForPhone(phoneDigits);

    const customer = await prisma.customer.create({
      data: {
        tenantId,
        name: displayName,
        phone: phoneDigits,
        email: emailFinal,
        loyaltyPoints: 0,
      },
    });
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "This number is already registered." }, { status: 409 });
    }
    console.error("[customers POST]", err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const actor = await getRequestActor(req, { allowedDeviceTypes: ["POS"] });
    if (!actor?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = actor.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"), 10);
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.customer.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { orders: true } } },
    });
    if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    if (existing._count.orders > 0) {
      return NextResponse.json(
        { error: "Cannot delete customer with orders. They have order history." },
        { status: 400 }
      );
    }

    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[customers DELETE]", err);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
