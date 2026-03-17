const DEFAULT_CURRENCY = "EUR";

function isTruthyEnv(value) {
  return ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
}

function normalizeCurrency(value) {
  const currency = String(value || DEFAULT_CURRENCY).trim().toUpperCase();
  return currency || DEFAULT_CURRENCY;
}

export function getPaymentCurrency() {
  return normalizeCurrency(process.env.PAYMENTS_CURRENCY);
}

export function isMockPaymentsEnabled() {
  return isTruthyEnv(process.env.PAYMENTS_MOCK_MODE);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function isPayPalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function getStripeMode() {
  if (isStripeConfigured()) return "live";
  if (isMockPaymentsEnabled()) return "mock";
  return "disabled";
}

export function getPayPalMode() {
  if (isPayPalConfigured()) return "live";
  if (isMockPaymentsEnabled()) return "mock";
  return "disabled";
}

export function getPayPalBaseUrl() {
  if (process.env.PAYPAL_API_BASE_URL) {
    return process.env.PAYPAL_API_BASE_URL;
  }

  return String(process.env.PAYPAL_ENV || "sandbox").toLowerCase() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function getPublicPaymentConfig() {
  return {
    currency: getPaymentCurrency(),
    mockMode: isMockPaymentsEnabled(),
    providers: {
      stripe: {
        enabled: getStripeMode() !== "disabled",
        mode: getStripeMode(),
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
      },
      paypal: {
        enabled: getPayPalMode() !== "disabled",
        mode: getPayPalMode(),
        clientId: process.env.PAYPAL_CLIENT_ID || null,
      },
    },
  };
}

export function assertStripeConfigured() {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
  }
}

export function assertPayPalConfigured() {
  if (!isPayPalConfigured()) {
    throw new Error("PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.");
  }
}

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function toMinorUnits(value) {
  return Math.round(roundMoney(value) * 100);
}

export function formatMoney(value) {
  return roundMoney(value).toFixed(2);
}
