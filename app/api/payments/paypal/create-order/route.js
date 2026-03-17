import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { createPosPayPalOrder } from "@/lib/payments/paypal";
import { roundMoney } from "@/lib/payments/config";

export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = token.tenantId ?? null;
    const branchId = token.branchId ?? null;
    const staffId = Number.parseInt(token.id, 10);

    if (!tenantId || !branchId || !staffId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const body = await request.json();
    const amount = roundMoney(body?.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "A positive PayPal amount is required." }, { status: 400 });
    }

    const order = await createPosPayPalOrder({
      amount,
      tenantId,
      branchId,
      staffId,
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("[paypal create-order]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order." },
      { status: 500 }
    );
  }
}
