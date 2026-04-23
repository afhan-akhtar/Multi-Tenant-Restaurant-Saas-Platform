/** Read commission model from plan.features JSON (platform SubscriptionPlan). */
export function getPlanCommissionMeta(plan) {
  const f = plan?.features;
  const raw = f && typeof f === "object" && !Array.isArray(f) ? f : {};
  const model = String(raw.commissionModel || "REVENUE_PERCENT").toUpperCase();
  const flatFeePerOrder = Number(raw.flatFeePerOrder || raw.flatFee || 0);
  return {
    model: model === "FLAT_PER_ORDER" ? "FLAT_PER_ORDER" : "REVENUE_PERCENT",
    flatFeePerOrder: Number.isFinite(flatFeePerOrder) ? flatFeePerOrder : 0,
    percent: Number(plan?.commissionPercent ?? 0),
  };
}

/** Order- or revenue-based commission for Super Admin reconciliation views. */
export function computeCommissionOwed(meta, revenue, orderCount) {
  if (meta.model === "FLAT_PER_ORDER" && meta.flatFeePerOrder > 0) {
    return meta.flatFeePerOrder * orderCount;
  }
  return (Number(revenue || 0) * meta.percent) / 100;
}
