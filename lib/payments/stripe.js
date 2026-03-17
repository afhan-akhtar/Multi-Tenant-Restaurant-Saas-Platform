import Stripe from "stripe";
import {
  assertStripeConfigured,
  getPaymentCurrency,
  getStripeMode,
  roundMoney,
  toMinorUnits,
} from "@/lib/payments/config";
import {
  createMockStripePaymentIntent,
  verifyMockStripePaymentIntent,
} from "@/lib/payments/mock";

const globalForStripe = globalThis;

function getStripeClient() {
  assertStripeConfigured();

  if (!globalForStripe.__stripeClient) {
    globalForStripe.__stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return globalForStripe.__stripeClient;
}

function getExpectedMetadata({ tenantId, branchId, staffId }) {
  return {
    integration: "restaurant_pos",
    tenantId: String(tenantId),
    branchId: String(branchId),
    staffId: String(staffId),
  };
}

export async function createPosPaymentIntent({ amount, tenantId, branchId, staffId }) {
  if (getStripeMode() === "mock") {
    return createMockStripePaymentIntent({ amount, tenantId, branchId, staffId });
  }

  const stripe = getStripeClient();
  const currency = getPaymentCurrency().toLowerCase();
  const normalizedAmount = roundMoney(amount);

  return stripe.paymentIntents.create({
    amount: toMinorUnits(normalizedAmount),
    currency,
    payment_method_types: ["card"],
    capture_method: "automatic",
    description: "Restaurant POS payment",
    metadata: getExpectedMetadata({ tenantId, branchId, staffId }),
  });
}

export async function verifyPosPaymentIntent({
  paymentIntentId,
  expectedAmount,
  tenantId,
  branchId,
  staffId,
}) {
  if (String(paymentIntentId || "").startsWith("pi_mock_")) {
    return verifyMockStripePaymentIntent({
      paymentIntentId,
      expectedAmount,
      tenantId,
      branchId,
      staffId,
    });
  }

  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const currency = getPaymentCurrency().toLowerCase();
  const metadata = paymentIntent.metadata || {};
  const expectedMetadata = getExpectedMetadata({ tenantId, branchId, staffId });

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Stripe payment is not completed.");
  }

  if (paymentIntent.currency !== currency) {
    throw new Error("Stripe payment currency does not match POS currency.");
  }

  if (paymentIntent.amount_received !== toMinorUnits(expectedAmount)) {
    throw new Error("Stripe payment amount does not match checkout split.");
  }

  for (const [key, value] of Object.entries(expectedMetadata)) {
    if (metadata[key] !== value) {
      throw new Error("Stripe payment does not belong to this POS session.");
    }
  }

  return paymentIntent;
}
