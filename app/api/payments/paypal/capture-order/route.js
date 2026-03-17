import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { capturePosPayPalOrder } from "@/lib/payments/paypal";
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
    const orderId = String(body?.orderId || "").trim();
    const amount = roundMoney(body?.amount);

    if (!orderId) {
      return NextResponse.json({ error: "PayPal order ID is required." }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "A positive PayPal amount is required." }, { status: 400 });
    }

    const captureResult = await capturePosPayPalOrder(orderId, {
      amount,
      tenantId,
      branchId,
      staffId,
    });
    const purchaseUnit = captureResult.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];

    if (!capture?.id) {
      return NextResponse.json({ error: "PayPal capture did not complete." }, { status: 400 });
    }

    return NextResponse.json({
      providerPayment: {
        method: "PAYPAL",
        amount,
        providerRef: capture.id,
        paypalOrderId: captureResult.id,
      },
    });
  } catch (error) {
    console.error("[paypal capture-order]", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture PayPal order." },
      { status: 500 }
    );
  }
}
