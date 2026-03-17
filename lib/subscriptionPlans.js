export const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    name: "Starter",
    monthlyPrice: 49,
    commissionPercent: 6,
    features: [
      "1 branch included",
      "POS and split payments",
      "Kitchen display system",
      "Basic reports and receipts",
      "Email support",
    ],
  },
  {
    name: "Growth",
    monthlyPrice: 129,
    commissionPercent: 4,
    features: [
      "Up to 3 branches",
      "POS, KDS, reservations, and loyalty",
      "Stripe and PayPal payments",
      "Advanced reports",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    monthlyPrice: 249,
    commissionPercent: 2.5,
    features: [
      "Unlimited branches",
      "Multi-branch operations dashboard",
      "Marketing and customer segmentation",
      "Dedicated onboarding support",
      "Custom rollout assistance",
    ],
  },
];

export function normalizePlanFeatures(features) {
  if (Array.isArray(features)) {
    return features
      .map((feature) => String(feature || "").trim())
      .filter(Boolean);
  }

  if (typeof features === "string") {
    return features
      .split(/\r?\n|,/)
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  if (features && typeof features === "object" && Array.isArray(features.items)) {
    return features.items
      .map((feature) => String(feature || "").trim())
      .filter(Boolean);
  }

  return [];
}

export function parsePlanPayload(body) {
  const name = String(body?.name || "").trim();
  const monthlyPrice = Number(body?.monthlyPrice);
  const commissionPercent = Number(body?.commissionPercent);
  const features = normalizePlanFeatures(body?.features);

  return {
    name,
    monthlyPrice,
    commissionPercent,
    features,
  };
}
