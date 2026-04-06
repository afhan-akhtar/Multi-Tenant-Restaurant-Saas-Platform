import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  normalizeCustomerPhone,
  isValidCustomerPhoneDigits,
  resolveCustomerName,
} from "@/lib/customerPhone";

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
    let nextPhone = existing.phone;

    if (phone !== undefined) {
      const digits = normalizeCustomerPhone(phone);
      const isWalkIn = String(existing.email || "").toLowerCase() === "walkin@internal.local";
      if (digits === "" && isWalkIn) {
        nextPhone = "";
        data.phone = "";
      } else if (!isValidCustomerPhoneDigits(digits)) {
        return NextResponse.json(
          { error: "Valid mobile number is required (7–15 digits)." },
          { status: 400 }
        );
      } else {
        const dup = await prisma.customer.findFirst({
          where: { tenantId, phone: digits, id: { not: id } },
        });
        if (dup) {
          return NextResponse.json({ error: "This number is already registered." }, { status: 409 });
        }
        nextPhone = digits;
        data.phone = digits;
      }
    }

    if (name !== undefined) {
      const trimmed = String(name).trim();
      data.name = trimmed || resolveCustomerName({ name: "", phoneDigits: nextPhone });
    } else if (phone !== undefined && data.phone !== undefined && data.phone !== "") {
      const isWalkIn = String(existing.email || "").toLowerCase() === "walkin@internal.local";
      if (!isWalkIn) {
        data.name = resolveCustomerName({ name: "", phoneDigits: nextPhone });
      }
    }

    if (email !== undefined) {
      const e = String(email).trim();
      data.email = e || existing.email;
    }

    if (loyaltyPoints !== undefined) data.loyaltyPoints = parseInt(loyaltyPoints, 10) || 0;

    const customer = await prisma.customer.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "This number is already registered." }, { status: 409 });
    }
    console.error("[customers PATCH]", err);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
