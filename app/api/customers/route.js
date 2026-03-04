import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });

    const body = await req.json();
    const { name, email, phone } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const customer = await prisma.customer.create({
      data: {
        tenantId,
        name: name.trim(),
        email: (email || "").trim() || `customer-${Date.now()}@placeholder.local`,
        phone: (phone || "").trim() || "",
        loyaltyPoints: 0,
      },
    });
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    console.error("[customers POST]", err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });

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
