import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { verifySubscriptionPaymentIntent } from "@/lib/payments/stripe";
import { recordInvoicePayment, serializeSubscription } from "@/lib/subscriptions";

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
    const paymentIntentId = String(body?.paymentIntentId || "").trim();
    const checkoutSessionId = String(body?.checkoutSessionId || "").trim();

    if (!invoiceId || !paymentIntentId || !checkoutSessionId) {
      return NextResponse.json(
        { error: "Invoice, Stripe payment intent, and checkout session are required." },
        { status: 400 }
      );
    }

    const invoice = await platformPrisma.billingInvoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: {
        subscription: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Invoice is already paid." }, { status: 400 });
    }

    const paymentIntent = await verifySubscriptionPaymentIntent({
      paymentIntentId,
      expectedAmount: Number(invoice.totalAmount),
      tenantId,
      invoiceId: invoice.id,
      subscriptionId: invoice.subscriptionId,
      checkoutSessionId,
    });

    const subscription = await platformPrisma.$transaction((tx) =>
      recordInvoicePayment(tx, {
        invoiceId: invoice.id,
        amount: Number(invoice.totalAmount),
        method: "STRIPE",
        reference: paymentIntent.id,
        notes: "Stripe browser card payment",
      })
    );

    return NextResponse.json({
      success: true,
      subscription: serializeSubscription(subscription),
      invoiceId: invoice.id,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("[subscription stripe complete]", error);
    return NextResponse.json(
      { error: error.message || "Failed to finalize subscription payment." },
      { status: 500 }
    );
  }
}
