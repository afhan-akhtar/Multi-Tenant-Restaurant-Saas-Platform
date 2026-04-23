export const SUBSCRIPTION_FEATURE_CATALOG = [
  {
    code: "POS",
    label: "POS system",
    description: "Core point-of-sale workflows and order capture.",
  },
  {
    code: "ONLINE_PAYMENTS",
    label: "Online payments",
    description: "Stripe and PayPal payment collection in POS.",
  },
  {
    code: "SPLIT_PAYMENTS",
    label: "Split payments",
    description: "Accept mixed and split tender at checkout.",
  },
  {
    code: "KDS",
    label: "Kitchen display system",
    description: "Kitchen order display and production tracking.",
  },
  {
    code: "TABLET",
    label: "Tableside tablet app",
    description: "Customer self-ordering and waiter tablet workflows at the table.",
  },
  {
    code: "REPORTS",
    label: "Reports",
    description: "Restaurant reporting and dashboard analytics.",
  },
  {
    code: "Z_REPORTS",
    label: "Z-reports",
    description: "Operational closeout and settlement reporting.",
  },
  {
    code: "CASHBOOK",
    label: "Cashbook",
    description: "Cash movement tracking and daily bookkeeping.",
  },
  {
    code: "TEAM_MANAGEMENT",
    label: "Team management",
    description: "Tenant admins plus role and permission management.",
  },
  {
    code: "LOYALTY",
    label: "Loyalty program",
    description: "Customer points and repeat-visit incentives.",
  },
  {
    code: "CUSTOMER_SEGMENTS",
    label: "Customer segments",
    description: "Segment customers for targeted campaigns.",
  },
  {
    code: "EMAIL_CAMPAIGNS",
    label: "Email campaigns",
    description: "Create and schedule marketing campaigns.",
  },
  {
    code: "MULTI_BRANCH",
    label: "Multi-branch operations",
    description: "Support and reporting across multiple branches.",
  },
];

const FEATURE_BY_CODE = Object.fromEntries(
  SUBSCRIPTION_FEATURE_CATALOG.map((feature) => [feature.code, feature])
);

export const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    code: "basic",
    name: "Basic",
    description: "Essential operations for a single restaurant location.",
    monthlyPrice: 49,
    commissionPercent: 6,
    trialDays: 14,
    graceDays: 5,
    sortOrder: 1,
    featureCodes: ["POS", "TABLET", "REPORTS", "CASHBOOK", "TEAM_MANAGEMENT"],
  },
  {
    code: "premium",
    name: "Premium",
    description: "Advanced operational tooling for growing restaurants.",
    monthlyPrice: 129,
    commissionPercent: 4,
    trialDays: 14,
    graceDays: 7,
    sortOrder: 2,
    featureCodes: [
      "POS",
      "TABLET",
      "ONLINE_PAYMENTS",
      "SPLIT_PAYMENTS",
      "KDS",
      "REPORTS",
      "Z_REPORTS",
      "CASHBOOK",
      "TEAM_MANAGEMENT",
      "LOYALTY",
    ],
  },
  {
    code: "enterprise",
    name: "Enterprise",
    description: "Full commercial feature set for multi-branch operators.",
    monthlyPrice: 249,
    commissionPercent: 2.5,
    trialDays: 21,
    graceDays: 10,
    sortOrder: 3,
    featureCodes: SUBSCRIPTION_FEATURE_CATALOG.map((feature) => feature.code),
  },
].map((plan) => ({
  ...plan,
  features: buildPlanFeatures(plan.featureCodes),
}));

function titleCaseFromCode(code) {
  return String(code || "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugifyPlanCode(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePlanFeatureCodes(features) {
  if (Array.isArray(features)) {
    return [...new Set(features.map((feature) => String(feature || "").trim().toUpperCase()).filter(Boolean))];
  }

  if (typeof features === "string") {
    return [...new Set(
      features
        .split(/\r?\n|,/)
        .map((feature) => String(feature || "").trim().toUpperCase())
        .filter(Boolean)
    )];
  }

  if (features && typeof features === "object") {
    if (Array.isArray(features.codes)) {
      return normalizePlanFeatureCodes(features.codes);
    }

    if (Array.isArray(features.items)) {
      return normalizePlanFeatureCodes(features.items);
    }
  }

  return [];
}

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

  if (features && typeof features === "object") {
    if (Array.isArray(features.items)) {
      return normalizePlanFeatures(features.items);
    }

    if (Array.isArray(features.codes)) {
      return features.codes
        .map((code) => FEATURE_BY_CODE[String(code || "").toUpperCase()]?.label || titleCaseFromCode(code))
        .filter(Boolean);
    }
  }

  return [];
}

export function getFeatureMeta(code) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  return FEATURE_BY_CODE[normalizedCode] || null;
}

export function getFeatureLabel(code) {
  return getFeatureMeta(code)?.label || titleCaseFromCode(code);
}

export function buildPlanFeatures(featureCodes = [], featureItems = null) {
  const codes = normalizePlanFeatureCodes(featureCodes);
  const items =
    featureItems && featureItems.length > 0
      ? normalizePlanFeatures(featureItems)
      : codes.map((code) => getFeatureLabel(code));

  return {
    codes,
    items,
  };
}

export function getPlanFeatureMatrix(features) {
  const enabledCodes = new Set(normalizePlanFeatureCodes(features));
  return SUBSCRIPTION_FEATURE_CATALOG.map((feature) => ({
    ...feature,
    enabled: enabledCodes.has(feature.code),
  }));
}

export function parsePlanPayload(body) {
  const name = String(body?.name || "").trim();
  const code = slugifyPlanCode(body?.code || name);
  const description = String(body?.description || "").trim();
  const monthlyPrice = Number(body?.monthlyPrice);
  const commissionPercent = Number(body?.commissionPercent);
  const trialDays = Math.max(0, Number(body?.trialDays || 0));
  const graceDays = Math.max(0, Number(body?.graceDays || 0));
  const sortOrder = Math.max(0, Number(body?.sortOrder || 0));
  const featureCodes = normalizePlanFeatureCodes(body?.featureCodes ?? body?.features);
  const commissionModel = String(body?.commissionModel || "REVENUE_PERCENT").toUpperCase();
  const flatFeeRaw = body?.flatFeePerOrder;
  const flatFeePerOrder =
    flatFeeRaw != null && flatFeeRaw !== "" ? Number(flatFeeRaw) : null;

  const built = buildPlanFeatures(featureCodes, body?.featureItems);
  const useFlat = commissionModel === "FLAT_PER_ORDER" && flatFeePerOrder != null && !Number.isNaN(flatFeePerOrder);
  const features = {
    ...built,
    commissionModel: useFlat ? "FLAT_PER_ORDER" : "REVENUE_PERCENT",
    ...(useFlat ? { flatFeePerOrder } : {}),
  };

  return {
    code,
    name,
    description,
    monthlyPrice,
    commissionPercent,
    trialDays,
    graceDays,
    sortOrder,
    features,
  };
}
