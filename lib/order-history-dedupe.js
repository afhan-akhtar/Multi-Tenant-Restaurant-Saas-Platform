/**
 * Collapse duplicate Order rows with the same orderNumber (e.g. double offline sync).
 * Prefer the row that is furthest in the workflow, not the newest id (which is often a duplicate OPEN).
 */

function orderStatusWorkflowRank(status) {
  const s = String(status || "").toUpperCase();
  const ranks = {
    OPEN: 1,
    CONFIRMED: 2,
    PREPARING: 3,
    READY: 4,
    PACK: 5,
    PARTIAL_REFUND: 5,
    COMPLETED: 6,
    CANCELLED: 0,
    REFUNDED: 0,
  };
  return ranks[s] ?? 0;
}

function pickBetterOrderDuplicate(prev, next) {
  const rPrev = orderStatusWorkflowRank(prev?.status);
  const rNext = orderStatusWorkflowRank(next?.status);
  if (rNext > rPrev) return next;
  if (rNext < rPrev) return prev;
  return Number(next.id) < Number(prev.id) ? next : prev;
}

export function dedupeOrderHistoryList(rows, limit = null) {
  if (!Array.isArray(rows) || rows.length === 0) return rows;

  const byId = new Map();
  for (const o of rows) {
    const id = Number(o?.id);
    if (!Number.isFinite(id)) continue;
    byId.set(id, o);
  }

  const byNumber = new Map();
  for (const o of byId.values()) {
    const label = String(o.orderNumber ?? "").trim();
    if (!label) {
      byNumber.set(`__id_${o.id}`, o);
      continue;
    }
    const prev = byNumber.get(label);
    if (!prev) {
      byNumber.set(label, o);
    } else {
      byNumber.set(label, pickBetterOrderDuplicate(prev, o));
    }
  }

  const sorted = [...byNumber.values()].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (tb !== ta) return tb - ta;
    return Number(b.id) - Number(a.id);
  });

  return typeof limit === "number" && Number.isFinite(limit) ? sorted.slice(0, limit) : sorted;
}
