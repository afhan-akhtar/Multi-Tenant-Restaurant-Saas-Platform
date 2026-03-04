import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });

    const id = parseInt(params?.id, 10);
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.customer.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const body = await req.json();
    const { name, email, phone, loyaltyPoints } = body;

    const data = {};
    if (name !== undefined) data.name = String(name).trim();
    if (email !== undefined) data.email = String(email).trim() || existing.email;
    if (phone !== undefined) data.phone = String(phone).trim();
    if (loyaltyPoints !== undefined) data.loyaltyPoints = parseInt(loyaltyPoints, 10) || 0;

    const customer = await prisma.customer.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    console.error("[customers PATCH]", err);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
