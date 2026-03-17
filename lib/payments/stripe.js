import Stripe from "stripe";
import {
  assertStripeConfigured,
  getPaymentCurrency,
  getStripeTerminalConfig,
  roundMoney,
  toMinorUnits,
} from "@/lib/payments/config";

const globalForStripe = globalThis;

function getStripeClient() {
  assertStripeConfigured();

  if (!globalForStripe.__stripeClient) {
    globalForStripe.__stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return globalForStripe.__stripeClient;
}

function getExpectedMetadata({ tenantId, branchId, staffId, checkoutSessionId, channel }) {
  return {
    integration: "restaurant_pos",
    tenantId: String(tenantId),
    branchId: String(branchId),
    staffId: String(staffId),
    checkoutSessionId: String(checkoutSessionId || ""),
    channel: String(channel || "browser"),
  };
}

export async function createPosPaymentIntent({
  amount,
  tenantId,
  branchId,
  staffId,
  checkoutSessionId,
  channel = "browser",
}) {
  const stripe = getStripeClient();
  const currency = getPaymentCurrency().toLowerCase();
  const normalizedAmount = roundMoney(amount);
  const paymentMethodTypes = channel === "reader" ? ["card_present"] : ["card"];

  return stripe.paymentIntents.create({
    amount: toMinorUnits(normalizedAmount),
    currency,
    payment_method_types: paymentMethodTypes,
    capture_method: "automatic",
    description: `Restaurant POS ${channel} payment`,
    metadata: getExpectedMetadata({ tenantId, branchId, staffId, checkoutSessionId, channel }),
  });
}

export async function createStripeTerminalConnectionToken() {
  const stripe = getStripeClient();
  const terminalConfig = getStripeTerminalConfig();

  return stripe.terminal.connectionTokens.create(
    terminalConfig.locationId ? { location: terminalConfig.locationId } : {}
  );
}

export async function verifyPosPaymentIntent({
  paymentIntentId,
  expectedAmount,
  tenantId,
  branchId,
  staffId,
  checkoutSessionId,
  channel = "browser",
}) {
  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const currency = getPaymentCurrency().toLowerCase();
  const metadata = paymentIntent.metadata || {};
  const expectedMetadata = getExpectedMetadata({
    tenantId,
    branchId,
    staffId,
    checkoutSessionId,
    channel,
  });

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Stripe payment is not completed.");
  }

  if (paymentIntent.currency !== currency) {
    throw new Error("Stripe payment currency does not match POS currency.");
  }

  if (paymentIntent.amount_received !== toMinorUnits(expectedAmount)) {
    throw new Error("Stripe payment amount does not match checkout split.");
  }

  if (channel === "reader" && !paymentIntent.payment_method_types?.includes("card_present")) {
    throw new Error("Stripe reader payment must use a card_present PaymentIntent.");
  }

  if (channel === "browser" && !paymentIntent.payment_method_types?.includes("card")) {
    throw new Error("Stripe browser payment must use a card PaymentIntent.");
  }

  for (const [key, value] of Object.entries(expectedMetadata)) {
    if (metadata[key] !== value) {
      throw new Error("Stripe payment does not belong to this POS session.");
    }
  }

  return paymentIntent;
}

export async function refundPosPaymentIntent(paymentIntentId) {
  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent.latest_charge) {
    throw new Error("Stripe payment has no charge to refund.");
  }

  return stripe.refunds.create({
    charge: String(paymentIntent.latest_charge),
  });
}
