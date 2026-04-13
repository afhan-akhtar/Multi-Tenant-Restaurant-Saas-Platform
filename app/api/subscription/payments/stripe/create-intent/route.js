import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { createSubscriptionPaymentIntent } from "@/lib/payments/stripe";

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
    if (!tenantId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const body = await request.json();
    const invoiceId = Number(body?.invoiceId);
    const checkoutSessionId = String(body?.checkoutSessionId || "").trim();

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice is required." }, { status: 400 });
    }

    if (!checkoutSessionId) {
      return NextResponse.json({ error: "Checkout session ID is required." }, { status: 400 });
    }

    const invoice = await platformPrisma.billingInvoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: { subscription: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Invoice is already paid." }, { status: 400 });
    }

    const paymentIntent = await createSubscriptionPaymentIntent({
      amount: Number(invoice.totalAmount),
      tenantId,
      invoiceId: invoice.id,
      subscriptionId: invoice.subscriptionId,
      checkoutSessionId,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: Number(invoice.totalAmount),
      invoiceNumber: invoice.invoiceNumber,
    });
  } catch (error) {
    console.error("[subscription stripe create-intent]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create subscription Stripe payment intent." },
      { status: 500 }
    );
  }
}
