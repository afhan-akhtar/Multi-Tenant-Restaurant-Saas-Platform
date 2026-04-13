import { getTenantPrisma } from "./tenant-db";

export const DEFAULT_LOYALTY_SETTINGS = {
  pointsPerEuro: 1,
  redemptionRate: 100,
  tier1Threshold: 500,
  tier2Threshold: 1000,
};

export function normalizeLoyaltySettings(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const ppe = Number(o.pointsPerEuro);
  const rr = Number(o.redemptionRate);
  return {
    pointsPerEuro: Number.isFinite(ppe) && ppe >= 0 ? ppe : DEFAULT_LOYALTY_SETTINGS.pointsPerEuro,
    redemptionRate: Number.isFinite(rr) && rr >= 1 ? rr : DEFAULT_LOYALTY_SETTINGS.redemptionRate,
    tier1Threshold: Math.max(0, parseInt(o.tier1Threshold, 10) || DEFAULT_LOYALTY_SETTINGS.tier1Threshold),
    tier2Threshold: Math.max(0, parseInt(o.tier2Threshold, 10) || DEFAULT_LOYALTY_SETTINGS.tier2Threshold),
  };
}

const WALKIN_EMAIL = "walkin@internal.local";

export function isWalkInCustomer(customer) {
  if (!customer) return true;
  return String(customer.email || "").toLowerCase() === WALKIN_EMAIL;
}

export function computePointsEarned(amountPaid, pointsPerEuro) {
  const paid = Number(amountPaid) || 0;
  const rate = Number(pointsPerEuro) || 0;
  if (paid <= 0 || rate <= 0) return 0;
  return Math.floor(paid * rate + 1e-9);
}

/**
 * @param {{ balance: number, requestedPoints: number, orderTotal: number, redemptionRate: number }} p
 */
export function computeRedemption(p) {
  const balance = Math.max(0, Math.floor(Number(p.balance) || 0));
  const requested = Math.max(0, Math.floor(Number(p.requestedPoints) || 0));
  const orderTotal = Math.max(0, Number(p.orderTotal) || 0);
  const redemptionRate = Math.max(1, Number(p.redemptionRate) || 1);

  if (requested === 0 || orderTotal <= 0) {
    return { points: 0, discount: 0 };
  }

  const maxByOrder = Math.floor(orderTotal * redemptionRate + 1e-9);
  let points = Math.min(requested, balance, maxByOrder);
  let discount = Math.round((points / redemptionRate) * 100) / 100;
  if (discount > orderTotal) {
    discount = Math.round(orderTotal * 100) / 100;
    points = Math.floor(discount * redemptionRate + 1e-9);
  }
  return { points, discount };
}

export async function getTenantLoyaltySettings(tenantId) {
  const prisma = await getTenantPrisma(tenantId);
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { loyaltySettings: true },
  });
  return normalizeLoyaltySettings(tenant?.loyaltySettings);
}
