import { prisma } from "./db";
import { formatDate } from "./dateFormat";
import {
  SUBSCRIPTION_FEATURE_CATALOG,
  buildPlanFeatures,
  getFeatureLabel,
  normalizePlanFeatureCodes,
  normalizePlanFeatures,
} from "./subscriptionPlans";

export const ROUTE_FEATURE_REQUIREMENTS = {
  "/pos": "POS",
  "/tablet": "TABLET",
  "/kds": "KDS",
  "/reports": "REPORTS",
  "/z-reports": "Z_REPORTS",
  "/cashbook": "CASHBOOK",
  "/loyalty": "LOYALTY",
  "/segments": "CUSTOMER_SEGMENTS",
  "/campaigns": "EMAIL_CAMPAIGNS",
  "/users": "TEAM_MANAGEMENT",
  "/roles": "TEAM_MANAGEMENT",
};

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

export function addDays(dateValue, days) {
  const next = new Date(dateValue);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(dateValue, months = 1) {
  const next = new Date(dateValue);
  next.setMonth(next.getMonth() + months);
  return next;
}

function safeDate(value) {
  return value ? new Date(value) : null;
}

function isPaidInvoice(invoice) {
  return invoice?.status === "PAID";
}

function isOpenInvoice(invoice) {
  return invoice && invoice.status !== "PAID" && invoice.status !== "VOID";
}

export function isSubscriptionBlockingStatus(status) {
  return status === "EXPIRED" || status === "CANCELLED";
}

function buildGraceEndDate(subscription) {
  if (subscription?.gracePeriodEndsAt) {
    return new Date(subscription.gracePeriodEndsAt);
  }

  const graceDays = Number(subscription?.plan?.graceDays || 0);
  if (graceDays <= 0) {
    return new Date(subscription.endDate);
  }

  return addDays(subscription.endDate, graceDays);
}

function buildInvoiceNumber(subscription, periodStart) {
  const stamp = new Date(periodStart).toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${subscription.tenantId}-${subscription.id}-${stamp}`;
}

async function getLatestInvoice(dbClient, subscriptionId) {
  return dbClient.billingInvoice.findFirst({
    where: { subscriptionId },
    orderBy: [{ periodEnd: "desc" }, { issuedAt: "desc" }],
  });
}

async function getCurrentPeriodInvoice(dbClient, subscriptionId, periodStart, periodEnd) {
  return dbClient.billingInvoice.findFirst({
    where: {
      subscriptionId,
      periodStart,
      periodEnd,
      status: { not: "VOID" },
    },
  });
}

export async function calculateSubscriptionCharges(
  dbClient,
  tenantId,
  plan,
  periodStart,
  periodEnd
) {
  const revenueAggregate = await dbClient.order.aggregate({
    where: {
      tenantId,
      status: "COMPLETED",
      createdAt: {
        gte: new Date(periodStart),
        lt: new Date(periodEnd),
      },
    },
    _sum: { grandTotal: true },
    _count: true,
  });

  const orderRevenue = roundMoney(revenueAggregate._sum.grandTotal);
  const commissionPercent = Number(plan?.commissionPercent || 0);
  const subscriptionFee = roundMoney(plan?.monthlyPrice);
  const commissionCharge = roundMoney((orderRevenue * commissionPercent) / 100);

  return {
    orderRevenue,
    orderCount: revenueAggregate._count || 0,
    subscriptionFee,
    commissionCharge,
    subtotal: roundMoney(subscriptionFee + commissionCharge),
  };
}

export async function createInvoiceForSubscription(
  dbClient,
  subscription,
  options = {}
) {
  const plan =
    subscription.plan ||
    (await dbClient.subscriptionPlan.findUnique({
      where: { id: subscription.planId },
    }));

  if (!plan) {
    throw new Error("Subscription plan not found.");
  }

  const periodStart = options.periodStart ? new Date(options.periodStart) : new Date(subscription.startDate);
  const periodEnd = options.periodEnd ? new Date(options.periodEnd) : new Date(subscription.endDate);
  const dueDate = options.dueDate ? new Date(options.dueDate) : new Date(periodEnd);

  const existing = await getCurrentPeriodInvoice(dbClient, subscription.id, periodStart, periodEnd);
  if (existing) {
    return existing;
  }

  const charges = await calculateSubscriptionCharges(
    dbClient,
    subscription.tenantId,
    plan,
    periodStart,
    periodEnd
  );

  return dbClient.billingInvoice.create({
    data: {
      tenantId: subscription.tenantId,
      subscriptionId: subscription.id,
      planId: plan.id,
      invoiceNumber: buildInvoiceNumber(subscription, periodStart),
      status: "OPEN",
      issuedAt: new Date(),
      dueDate,
      periodStart,
      periodEnd,
      subtotal: charges.subtotal,
      taxAmount: 0,
      totalAmount: charges.subtotal,
      lineItems: [
        {
          code: "subscription_fee",
          label: `${plan.name} platform subscription`,
          description: `Billing period ${formatDate(periodStart)} - ${formatDate(periodEnd)}`,
          amount: charges.subscriptionFee,
        },
        {
          code: "commission",
          label: "Order commission",
          description: `${Number(plan.commissionPercent || 0)}% commission on ${charges.orderCount} completed order(s)`,
          amount: charges.commissionCharge,
          orderRevenue: charges.orderRevenue,
        },
      ],
      notes:
        options.notes ||
        `Auto-generated for ${plan.name} subscription billing.`,
    },
  });
}

function deriveSubscriptionStatus(subscription, latestInvoice, now = new Date()) {
  if (!subscription) {
    return null;
  }

  if (subscription.status === "CANCELLED" && now >= new Date(subscription.endDate)) {
    return "CANCELLED";
  }

  const trialEndDate = safeDate(subscription.trialEndDate);
  if (trialEndDate && now < trialEndDate) {
    return "TRIALING";
  }

  const periodEnd = new Date(subscription.endDate);
  const gracePeriodEndsAt = buildGraceEndDate(subscription);

  if (isOpenInvoice(latestInvoice) && now > new Date(latestInvoice.dueDate)) {
    if (now <= gracePeriodEndsAt) {
      return "GRACE_PERIOD";
    }

    if (now <= periodEnd) {
      return "PAST_DUE";
    }

    return "EXPIRED";
  }

  if (now > periodEnd && !isPaidInvoice(latestInvoice)) {
    return "EXPIRED";
  }

  return "ACTIVE";
}

async function hydrateSubscription(dbClient, subscriptionId) {
  return dbClient.tenantSubscription.findUnique({
    where: { id: subscriptionId },
    include: {
      tenant: true,
      plan: true,
      invoices: {
        include: {
          payments: {
            orderBy: { paidAt: "desc" },
          },
        },
        orderBy: [{ periodEnd: "desc" }, { issuedAt: "desc" }],
      },
    },
  });
}

async function syncInvoiceStatus(dbClient, invoice, now = new Date()) {
  if (!invoice || invoice.status === "PAID" || invoice.status === "VOID") {
    return invoice;
  }

  const nextStatus = now > new Date(invoice.dueDate) ? "OVERDUE" : "OPEN";
  if (nextStatus === invoice.status) {
    return invoice;
  }

  return dbClient.billingInvoice.update({
    where: { id: invoice.id },
    data: { status: nextStatus },
  });
}

export async function syncSubscriptionState(dbClient, subscriptionId, now = new Date()) {
  let subscription = await hydrateSubscription(dbClient, subscriptionId);
  if (!subscription) {
    return null;
  }

  let latestInvoice = subscription.invoices?.[0] || null;
  if (!latestInvoice) {
    latestInvoice = await createInvoiceForSubscription(dbClient, subscription);
  }

  latestInvoice = await syncInvoiceStatus(dbClient, latestInvoice, now);

  // Renew automatically only when the current period has ended and the current invoice is paid.
  if (
    now >= new Date(subscription.endDate) &&
    isPaidInvoice(latestInvoice) &&
    subscription.autoRenew &&
    !subscription.cancelAtPeriodEnd
  ) {
    const nextStartDate = new Date(subscription.endDate);
    const nextEndDate = addMonths(nextStartDate, 1);
    const nextGraceEnd = addDays(nextEndDate, Number(subscription.plan?.graceDays || 0));

    await dbClient.tenantSubscription.update({
      where: { id: subscription.id },
      data: {
        startDate: nextStartDate,
        endDate: nextEndDate,
        nextBillingDate: nextEndDate,
        gracePeriodEndsAt: nextGraceEnd,
        status: "ACTIVE",
      },
    });

    const renewed = await hydrateSubscription(dbClient, subscription.id);
    await createInvoiceForSubscription(dbClient, renewed, {
      periodStart: nextStartDate,
      periodEnd: nextEndDate,
      dueDate: nextEndDate,
    });

    subscription = await hydrateSubscription(dbClient, subscription.id);
    latestInvoice = subscription.invoices?.[0] || null;
  }

  const nextStatus = deriveSubscriptionStatus(subscription, latestInvoice, now);
  const nextGraceEnd = buildGraceEndDate(subscription);

  if (
    nextStatus !== subscription.status ||
    String(nextGraceEnd) !== String(subscription.gracePeriodEndsAt)
  ) {
    await dbClient.tenantSubscription.update({
      where: { id: subscription.id },
      data: {
        status: nextStatus,
        gracePeriodEndsAt: nextGraceEnd,
      },
    });

    subscription = await hydrateSubscription(dbClient, subscription.id);
  }

  return subscription;
}

export async function syncTenantSubscription(dbClient, tenantId, now = new Date()) {
  const latestSubscription = await dbClient.tenantSubscription.findFirst({
    where: { tenantId },
    include: { plan: true },
    orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
  });

  if (!latestSubscription) {
    return null;
  }

  return syncSubscriptionState(dbClient, latestSubscription.id, now);
}

export async function runSubscriptionBillingCycle(dbClient = prisma) {
  const subscriptions = await dbClient.tenantSubscription.findMany({
    select: { id: true },
  });

  const results = [];
  for (const subscription of subscriptions) {
    const synced = await syncSubscriptionState(dbClient, subscription.id);
    if (synced) {
      results.push(synced);
    }
  }

  return results;
}

function serializePayment(payment) {
  return {
    id: payment.id,
    invoiceId: payment.invoiceId,
    tenantId: payment.tenantId,
    amount: roundMoney(payment.amount),
    method: payment.method,
    status: payment.status,
    paidAt: payment.paidAt?.toISOString?.() || null,
    reference: payment.reference || "",
    notes: payment.notes || "",
  };
}

function serializeInvoice(invoice) {
  return {
    id: invoice.id,
    subscriptionId: invoice.subscriptionId,
    tenantId: invoice.tenantId,
    planId: invoice.planId,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    issuedAt: invoice.issuedAt?.toISOString?.() || null,
    dueDate: invoice.dueDate?.toISOString?.() || null,
    periodStart: invoice.periodStart?.toISOString?.() || null,
    periodEnd: invoice.periodEnd?.toISOString?.() || null,
    subtotal: roundMoney(invoice.subtotal),
    taxAmount: roundMoney(invoice.taxAmount),
    totalAmount: roundMoney(invoice.totalAmount),
    currency: invoice.currency || "EUR",
    lineItems: Array.isArray(invoice.lineItems) ? invoice.lineItems : [],
    notes: invoice.notes || "",
    payments: Array.isArray(invoice.payments) ? invoice.payments.map(serializePayment) : [],
  };
}

export function serializeSubscription(subscription) {
  if (!subscription) {
    return null;
  }

  const featureCodes = normalizePlanFeatureCodes(subscription.plan?.features);
  const featureLabels = normalizePlanFeatures(subscription.plan?.features);
  const featureMatrix = SUBSCRIPTION_FEATURE_CATALOG.map((feature) => ({
    ...feature,
    enabled: featureCodes.includes(feature.code),
  }));

  return {
    id: subscription.id,
    tenantId: subscription.tenantId,
    planId: subscription.planId,
    status: subscription.status,
    startDate: subscription.startDate?.toISOString?.() || null,
    endDate: subscription.endDate?.toISOString?.() || null,
    trialStartDate: subscription.trialStartDate?.toISOString?.() || null,
    trialEndDate: subscription.trialEndDate?.toISOString?.() || null,
    gracePeriodEndsAt: subscription.gracePeriodEndsAt?.toISOString?.() || null,
    nextBillingDate: subscription.nextBillingDate?.toISOString?.() || null,
    autoRenew: Boolean(subscription.autoRenew),
    cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
    plan: subscription.plan
      ? {
          id: subscription.plan.id,
          code: subscription.plan.code,
          name: subscription.plan.name,
          description: subscription.plan.description || "",
          billingInterval: subscription.plan.billingInterval,
          monthlyPrice: roundMoney(subscription.plan.monthlyPrice),
          commissionPercent: roundMoney(subscription.plan.commissionPercent),
          trialDays: Number(subscription.plan.trialDays || 0),
          graceDays: Number(subscription.plan.graceDays || 0),
          sortOrder: Number(subscription.plan.sortOrder || 0),
          features: buildPlanFeatures(featureCodes, featureLabels),
          featureMatrix,
        }
      : null,
    tenant: subscription.tenant
      ? {
          id: subscription.tenant.id,
          name: subscription.tenant.name,
          subdomain: subscription.tenant.subdomain,
          status: subscription.tenant.status,
        }
      : null,
    invoices: Array.isArray(subscription.invoices) ? subscription.invoices.map(serializeInvoice) : [],
  };
}

export function hasPlanFeature(subscription, featureCode) {
  const enabledCodes = new Set(normalizePlanFeatureCodes(subscription?.plan?.features));
  return enabledCodes.has(String(featureCode || "").trim().toUpperCase());
}

export async function getTenantSubscriptionAccess(tenantId) {
  const subscription = await syncTenantSubscription(prisma, tenantId);
  const serialized = serializeSubscription(subscription);

  if (!serialized) {
    return {
      hasSubscription: false,
      isBlocked: true,
      billingIssue: "No subscription assigned.",
      subscription: null,
      featureCodes: [],
      featureMatrix: SUBSCRIPTION_FEATURE_CATALOG.map((feature) => ({ ...feature, enabled: false })),
    };
  }

  const featureCodes = normalizePlanFeatureCodes(serialized.plan?.features);
  const latestInvoice = serialized.invoices?.[0] || null;

  return {
    hasSubscription: true,
    isBlocked: isSubscriptionBlockingStatus(serialized.status),
    billingIssue:
      serialized.status === "GRACE_PERIOD"
        ? "Payment overdue. Grace period is active."
        : serialized.status === "PAST_DUE"
          ? "Payment overdue. Service may be interrupted soon."
          : serialized.status === "EXPIRED"
            ? "Subscription expired. Renew or record payment to restore access."
            : null,
    featureCodes,
    featureMatrix: serialized.plan?.featureMatrix || [],
    latestInvoice,
    subscription: serialized,
  };
}

export async function assertTenantFeatureAccess(tenantId, featureCode) {
  const access = await getTenantSubscriptionAccess(tenantId);

  if (!access.hasSubscription) {
    return {
      ok: false,
      status: 402,
      error: "No subscription is assigned to this restaurant.",
      access,
    };
  }

  if (access.isBlocked) {
    return {
      ok: false,
      status: 402,
      error: access.billingIssue || "Subscription is not active.",
      access,
    };
  }

  if (featureCode && !access.featureCodes.includes(String(featureCode).toUpperCase())) {
    return {
      ok: false,
      status: 403,
      error: `${getFeatureLabel(featureCode)} is not enabled for the current plan.`,
      access,
    };
  }

  return { ok: true, status: 200, access };
}

export async function recordInvoicePayment(
  dbClient,
  { invoiceId, amount, method = "MANUAL", reference = "", notes = "" }
) {
  const invoice = await dbClient.billingInvoice.findUnique({
    where: { id: invoiceId },
    include: {
      subscription: {
        include: { plan: true },
      },
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  if (invoice.status === "PAID") {
    throw new Error("This invoice is already paid.");
  }

  const paymentAmount = roundMoney(amount || invoice.totalAmount);
  if (paymentAmount <= 0) {
    throw new Error("A positive payment amount is required.");
  }

  const invoiceTotal = roundMoney(invoice.totalAmount);
  if (paymentAmount < invoiceTotal) {
    throw new Error("Full invoice amount is required to mark the invoice paid.");
  }

  await dbClient.billingPayment.create({
    data: {
      invoiceId: invoice.id,
      tenantId: invoice.tenantId,
      amount: paymentAmount,
      method,
      status: "SUCCEEDED",
      paidAt: new Date(),
      reference,
      notes,
    },
  });

  await dbClient.billingInvoice.update({
    where: { id: invoice.id },
    data: {
      status: "PAID",
    },
  });

  return syncSubscriptionState(dbClient, invoice.subscriptionId);
}

export async function assignSubscriptionToTenant(
  dbClient,
  { tenantId, planId, startDate = new Date(), autoRenew = true }
) {
  const [tenant, plan] = await Promise.all([
    dbClient.tenant.findUnique({ where: { id: tenantId } }),
    dbClient.subscriptionPlan.findUnique({ where: { id: planId } }),
  ]);

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (!plan) {
    throw new Error("Plan not found.");
  }

  const periodStart = new Date(startDate);
  const periodEnd = addMonths(periodStart, 1);
  const trialEndDate = Number(plan.trialDays || 0) > 0 ? addDays(periodStart, Number(plan.trialDays)) : null;
  const gracePeriodEndsAt = addDays(periodEnd, Number(plan.graceDays || 0));

  await dbClient.tenantSubscription.updateMany({
    where: {
      tenantId,
      status: { in: ["TRIALING", "ACTIVE", "GRACE_PERIOD", "PAST_DUE"] },
    },
    data: {
      status: "CANCELLED",
      endDate: periodStart,
      cancelAtPeriodEnd: false,
      autoRenew: false,
    },
  });

  const subscription = await dbClient.tenantSubscription.create({
    data: {
      tenantId,
      planId,
      status: trialEndDate ? "TRIALING" : "ACTIVE",
      startDate: periodStart,
      endDate: periodEnd,
      trialStartDate: trialEndDate ? periodStart : null,
      trialEndDate,
      gracePeriodEndsAt,
      nextBillingDate: periodEnd,
      autoRenew,
      cancelAtPeriodEnd: false,
    },
    include: {
      plan: true,
    },
  });

  await createInvoiceForSubscription(dbClient, subscription, {
    periodStart,
    periodEnd,
    dueDate: periodEnd,
    notes: "Initial invoice created when the subscription was assigned.",
  });

  return syncSubscriptionState(dbClient, subscription.id);
}

export async function getDefaultOnboardingPlan(dbClient) {
  const byCode = await dbClient.subscriptionPlan.findFirst({
    where: { code: "basic" },
    orderBy: [{ sortOrder: "asc" }, { monthlyPrice: "asc" }],
  });

  if (byCode) {
    return byCode;
  }

  return dbClient.subscriptionPlan.findFirst({
    orderBy: [{ sortOrder: "asc" }, { monthlyPrice: "asc" }],
  });
}

export async function ensureTenantOnboardingSubscription(dbClient, tenantId) {
  const existing = await dbClient.tenantSubscription.findFirst({
    where: {
      tenantId,
      status: { in: ["TRIALING", "ACTIVE", "GRACE_PERIOD", "PAST_DUE"] },
    },
    orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
  });

  if (existing) {
    return syncSubscriptionState(dbClient, existing.id);
  }

  const defaultPlan = await getDefaultOnboardingPlan(dbClient);
  if (!defaultPlan) {
    return null;
  }

  return assignSubscriptionToTenant(dbClient, {
    tenantId,
    planId: defaultPlan.id,
  });
}
