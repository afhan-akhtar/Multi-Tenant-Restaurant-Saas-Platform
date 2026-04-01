import crypto from "crypto";
import { prisma } from "@/lib/db";
import { dedupeOrderHistoryList } from "@/lib/order-history-dedupe";
import { roundMoney } from "@/lib/payments/config";
import { refundPosPaymentIntent } from "@/lib/payments/stripe";
import { refundPayPalCapture } from "@/lib/payments/paypal";

const REFUND_ELIGIBLE_PAYMENT_STATUSES = ["COMPLETED", "PARTIALLY_REFUNDED", "REFUNDED"];
const CASH_METHODS = new Set(["CASH"]);
const STRIPE_METHODS = new Set(["STRIPE", "CARD"]);
const PAYPAL_METHODS = new Set(["PAYPAL"]);

export class RefundServiceError extends Error {
  constructor(message, status = 400, code = "REFUND_ERROR") {
    super(message);
    this.name = "RefundServiceError";
    this.status = status;
    this.code = code;
  }
}

function toNum(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(value);
}

function toCents(value) {
  return Math.round(toNum(value) * 100);
}

function fromCents(value) {
  return roundMoney(value / 100);
}

function normalizeRoleName(roleName) {
  return String(roleName || "").trim().toUpperCase();
}

function canManageRefunds(roleName) {
  const normalized = normalizeRoleName(roleName);
  return normalized.includes("ADMIN") || normalized.includes("MANAGER");
}

function makeBatchKey(orderId) {
  return `refund_${orderId}_${crypto.randomUUID()}`;
}

function allocateAcrossWeightedTargets(totalAmount, targets) {
  const totalCents = toCents(totalAmount);
  const normalizedTargets = (targets || [])
    .map((target) => ({ ...target, weight: Math.max(0, toNum(target.weight)) }))
    .filter((target) => target.weight > 0);

  if (totalCents <= 0 || normalizedTargets.length === 0) {
    return [];
  }

  const totalWeight = normalizedTargets.reduce((sum, target) => sum + target.weight, 0);
  if (totalWeight <= 0) {
    return normalizedTargets.map((target, index) => ({
      id: target.id ?? index,
      amount: 0,
      source: target.source,
    }));
  }

  const exactAllocations = normalizedTargets.map((target, index) => {
    const exact = (totalCents * target.weight) / totalWeight;
    const base = Math.floor(exact);
    return {
      id: target.id ?? index,
      amountCents: base,
      remainder: exact - base,
      source: target.source,
    };
  });

  let remainingCents =
    totalCents - exactAllocations.reduce((sum, target) => sum + target.amountCents, 0);

  exactAllocations
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((target) => {
      if (remainingCents <= 0) return;
      target.amountCents += 1;
      remainingCents -= 1;
    });

  return exactAllocations
    .map((target) => ({
      id: target.id,
      amount: fromCents(target.amountCents),
      source: target.source,
    }))
    .filter((target) => target.amount > 0);
}

function getOrderTotalAmount(order) {
  return roundMoney(toNum(order?.totalAmount) || toNum(order?.grandTotal));
}

function getPaidAmount(order) {
  return roundMoney(
    (order?.payments || [])
      .filter((payment) => REFUND_ELIGIBLE_PAYMENT_STATUSES.includes(payment.status))
      .reduce((sum, payment) => sum + toNum(payment.amount), 0)
  );
}

function getRemainingRefundableByPayment(payment) {
  return roundMoney(toNum(payment.amount) - toNum(payment.refundedAmount));
}

function buildOrderItemRefundMap(order) {
  const items = order?.orderItems || [];
  const orderTotal = getOrderTotalAmount(order);
  const weightedTargets = items.map((item) => ({
    id: item.id,
    weight: Math.max(0.0001, toNum(item.totalAmount)),
    source: item,
  }));
  const allocations = allocateAcrossWeightedTargets(orderTotal, weightedTargets);
  return new Map(allocations.map((allocation) => [allocation.id, allocation.amount]));
}

function serializeRefund(refund) {
  return {
    id: refund.id,
    orderId: refund.orderId,
    paymentId: refund.paymentId,
    itemId: refund.itemId,
    amount: toNum(refund.amount),
    reason: refund.reason,
    paymentMethod: refund.paymentMethod,
    refundType: refund.refundType,
    externalRefundId: refund.externalRefundId || null,
    batchKey: refund.batchKey || null,
    createdAt: refund.createdAt?.toISOString?.() || null,
    actorName: refund.actor?.name || null,
    metadata: refund.metadata || null,
  };
}

function serializeRefundHistory(refunds) {
  const groups = new Map();

  for (const refund of refunds || []) {
    const key = refund.batchKey || `refund_${refund.id}`;
    const existing = groups.get(key) || {
      id: key,
      batchKey: refund.batchKey || null,
      amount: 0,
      reason: refund.reason,
      refundType: refund.refundType,
      createdAt: refund.createdAt?.toISOString?.() || null,
      actorName: refund.actor?.name || null,
      paymentMethods: new Set(),
      rows: [],
    };

    existing.amount = roundMoney(existing.amount + toNum(refund.amount));
    if (refund.paymentMethod) {
      existing.paymentMethods.add(refund.paymentMethod);
    }
    existing.rows.push(serializeRefund(refund));
    groups.set(key, existing);
  }

  return Array.from(groups.values()).map((group) => ({
    id: group.id,
    batchKey: group.batchKey,
    amount: group.amount,
    reason: group.reason,
    refundType: group.refundType,
    createdAt: group.createdAt,
    actorName: group.actorName,
    paymentMethod: Array.from(group.paymentMethods).join(" + ") || null,
    rows: group.rows,
  }));
}

function serializeOrderHistoryEntry(order) {
  const itemRefundMap = buildOrderItemRefundMap(order);
  const paidAmount = getPaidAmount(order);
  const refundedAmount = roundMoney(toNum(order.refundedAmount));

  return {
    id: order.id,
    tenantId: order.tenantId,
    branchId: order.branchId,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt?.toISOString?.() || null,
    totalAmount: getOrderTotalAmount(order),
    grandTotal: roundMoney(toNum(order.grandTotal)),
    paidAmount,
    refundedAmount,
    refundableAmount: Math.max(0, roundMoney(paidAmount - refundedAmount)),
    customer: order.customer
      ? {
          id: order.customer.id,
          name: order.customer.name,
          phone: order.customer.phone || "",
        }
      : null,
    items: (order.orderItems || []).map((item) => ({
      id: item.id,
      name: item.name || item.productName,
      quantity: item.quantity,
      price: roundMoney(toNum(item.price) || toNum(item.unitPrice)),
      totalAmount: roundMoney(toNum(item.totalAmount)),
      refundableAmount: roundMoney(itemRefundMap.get(item.id) || 0),
      refunded: Boolean(item.refunded),
      status: item.status,
    })),
    payments: (order.payments || []).map((payment) => {
      const refunded = roundMoney(toNum(payment.refundedAmount));
      return {
        id: payment.id,
        method: payment.method,
        status: payment.status,
        amount: roundMoney(toNum(payment.amount)),
        refundedAmount: refunded,
        refundableAmount: Math.max(0, roundMoney(toNum(payment.amount) - refunded)),
        transactionId: payment.transactionId || payment.providerRef || null,
        createdAt: payment.createdAt?.toISOString?.() || null,
      };
    }),
    refunds: serializeRefundHistory(order.refunds || []),
  };
}

async function loadRefundStaff(actor, tenantId) {
  const staffId = Number.parseInt(String(actor?.staffId ?? ""), 10);
  if (!staffId) {
    throw new RefundServiceError("Only authenticated managers can perform refunds.", 403, "REFUND_FORBIDDEN");
  }

  const staff = await prisma.tenantAdmin.findFirst({
    where: {
      id: staffId,
      tenantId,
      status: "ACTIVE",
    },
    include: { role: true },
  });

  if (!staff) {
    throw new RefundServiceError("Refund operator was not found for this restaurant.", 403, "REFUND_FORBIDDEN");
  }

  return staff;
}

export async function assertRefundAccess({ actor, tenantId }) {
  const staff = await loadRefundStaff(actor, tenantId);
  const roleName = staff.role?.name || actor?.roleName || "";

  if (!canManageRefunds(roleName)) {
    throw new RefundServiceError("Only ADMIN or MANAGER roles can perform refunds.", 403, "REFUND_FORBIDDEN");
  }

  return staff;
}

async function getOrderForRefund({ tenantId, orderId }) {
  const parsedOrderId = Number.parseInt(String(orderId || ""), 10);
  if (!parsedOrderId) {
    throw new RefundServiceError("Order ID is required.", 400, "ORDER_ID_REQUIRED");
  }

  const order = await prisma.order.findFirst({
    where: { id: parsedOrderId, tenantId },
    include: {
      customer: {
        select: { id: true, name: true, phone: true },
      },
      orderItems: {
        orderBy: { id: "asc" },
      },
      payments: {
        orderBy: { id: "asc" },
      },
      refunds: {
        include: {
          actor: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    throw new RefundServiceError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  return order;
}

function ensureOrderCanBeRefunded(order) {
  if (order.status === "CANCELLED" && toNum(order.refundedAmount) >= getPaidAmount(order) - 0.01) {
    throw new RefundServiceError("This order has already been fully refunded.", 400, "ORDER_ALREADY_REFUNDED");
  }

  const paidAmount = getPaidAmount(order);
  if (paidAmount <= 0) {
    throw new RefundServiceError("This order has no completed payment to refund.", 400, "ORDER_UNPAID");
  }
}

function buildPaymentRefundPlan(order, refundAmount) {
  const refundablePayments = (order.payments || [])
    .map((payment) => ({
      payment,
      refundableAmount: getRemainingRefundableByPayment(payment),
    }))
    .filter((entry) => REFUND_ELIGIBLE_PAYMENT_STATUSES.includes(entry.payment.status) && entry.refundableAmount > 0);

  const paymentAllocations = allocateAcrossWeightedTargets(
    refundAmount,
    refundablePayments.map((entry) => ({
      id: entry.payment.id,
      weight: entry.refundableAmount,
      source: entry.payment,
    }))
  );

  const allocatedAmount = roundMoney(
    paymentAllocations.reduce((sum, allocation) => sum + toNum(allocation.amount), 0)
  );

  if (Math.abs(allocatedAmount - refundAmount) > 0.01) {
    throw new RefundServiceError("Unable to allocate the refund across the original payments.", 400, "PAYMENT_ALLOCATION_FAILED");
  }

  return paymentAllocations.map((allocation) => ({
    payment: allocation.source,
    amount: roundMoney(allocation.amount),
  }));
}

async function runExternalRefund(payment, amount, { order, reason, batchKey }) {
  const transactionId = String(payment.transactionId || payment.providerRef || "").trim();
  const metadata = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    tenantId: order.tenantId,
    batchKey,
  };

  if (CASH_METHODS.has(payment.method)) {
    return {
      externalRefundId: null,
      providerPayload: {
        recordedInternally: true,
      },
    };
  }

  if (!transactionId) {
    throw new RefundServiceError(
      `Payment ${payment.id} is missing the original transaction reference.`,
      400,
      "PAYMENT_REFERENCE_MISSING"
    );
  }

  if (STRIPE_METHODS.has(payment.method)) {
    const stripeRefund = await refundPosPaymentIntent({
      paymentIntentId: transactionId,
      amount,
      metadata,
      idempotencyKey: `${batchKey}_${payment.id}`,
    });

    return {
      externalRefundId: stripeRefund.id || null,
      providerPayload: {
        provider: "stripe",
        status: stripeRefund.status || null,
      },
    };
  }

  if (PAYPAL_METHODS.has(payment.method)) {
    const paypalRefund = await refundPayPalCapture({
      captureId: transactionId,
      amount,
      note: reason,
    });

    return {
      externalRefundId: paypalRefund.id || null,
      providerPayload: {
        provider: "paypal",
        status: paypalRefund.status || null,
      },
    };
  }

  throw new RefundServiceError(
    `Refunds are not supported for payment method ${payment.method}.`,
    400,
    "PAYMENT_METHOD_UNSUPPORTED"
  );
}

function buildPartialRefundRecords({
  selectedItems,
  paymentPlans,
  reason,
  tenantId,
  actorId,
  batchKey,
}) {
  const itemTargets = selectedItems.map((item) => ({
    id: item.id,
    weight: item.refundAmount,
    source: item,
  }));

  return paymentPlans.flatMap((paymentPlan) => {
    const perPaymentItemAllocations = allocateAcrossWeightedTargets(paymentPlan.amount, itemTargets);
    return perPaymentItemAllocations.map((allocation) => ({
      tenantId,
      orderId: paymentPlan.payment.orderId,
      paymentId: paymentPlan.payment.id,
      itemId: allocation.source.id,
      actorId,
      batchKey,
      amount: allocation.amount,
      reason,
      paymentMethod: paymentPlan.payment.method,
      refundType: "ITEM",
      externalRefundId: paymentPlan.externalRefundId,
      metadata: {
        provider: paymentPlan.providerPayload?.provider || "internal",
        providerStatus: paymentPlan.providerPayload?.status || null,
        itemName: allocation.source.name,
      },
    }));
  });
}

function buildFullRefundRecords({
  order,
  paymentPlans,
  reason,
  tenantId,
  actorId,
  batchKey,
}) {
  return paymentPlans.map((paymentPlan) => ({
    tenantId,
    orderId: order.id,
    paymentId: paymentPlan.payment.id,
    itemId: null,
    actorId,
    batchKey,
    amount: paymentPlan.amount,
    reason,
    paymentMethod: paymentPlan.payment.method,
    refundType: "FULL_ORDER",
    externalRefundId: paymentPlan.externalRefundId,
    metadata: {
      provider: paymentPlan.providerPayload?.provider || "internal",
      providerStatus: paymentPlan.providerPayload?.status || null,
    },
  }));
}

async function finalizeRefund({
  order,
  refundAmount,
  paymentPlans,
  refundRecords,
  actorId,
  nextOrderStatus,
  itemIdsToMarkRefunded = [],
  itemStatus = null,
  fullCancellation = false,
}) {
  const createdAt = new Date();

  await prisma.$transaction(async (tx) => {
    for (const paymentPlan of paymentPlans) {
      const nextRefundedAmount = roundMoney(
        toNum(paymentPlan.payment.refundedAmount) + toNum(paymentPlan.amount)
      );
      const nextStatus =
        nextRefundedAmount >= roundMoney(toNum(paymentPlan.payment.amount)) - 0.01
          ? "REFUNDED"
          : "PARTIALLY_REFUNDED";

      await tx.payment.update({
        where: { id: paymentPlan.payment.id },
        data: {
          refundedAmount: nextRefundedAmount,
          refundedAt: createdAt,
          status: nextStatus,
        },
      });
    }

    if (itemIdsToMarkRefunded.length > 0) {
      await tx.orderItem.updateMany({
        where: {
          id: { in: itemIdsToMarkRefunded },
          orderId: order.id,
        },
        data: {
          refunded: true,
          ...(itemStatus ? { status: itemStatus } : {}),
        },
      });
    }

    await tx.refund.createMany({
      data: refundRecords.map((record) => ({
        ...record,
        createdAt,
      })),
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: nextOrderStatus,
        refundedAmount: roundMoney(toNum(order.refundedAmount) + refundAmount),
        lastRefundAt: createdAt,
      },
    });

    await tx.auditLog.create({
      data: {
        tenantId: order.tenantId,
        actorId,
        action: fullCancellation ? "ORDER_FULL_REFUND" : "ORDER_PARTIAL_REFUND",
        entityType: "ORDER",
        entityId: order.id,
        createdAt,
      },
    });
  });

  return getOrderForRefund({ tenantId: order.tenantId, orderId: order.id });
}

export async function refundOrderItems({
  tenantId,
  actor,
  orderId,
  itemIds,
  reason,
}) {
  const trimmedReason = String(reason || "").trim();
  if (!trimmedReason) {
    throw new RefundServiceError("A refund reason is required.", 400, "REFUND_REASON_REQUIRED");
  }

  const parsedItemIds = [...new Set((Array.isArray(itemIds) ? itemIds : []).map((id) => Number.parseInt(String(id), 10)).filter(Boolean))];
  if (parsedItemIds.length === 0) {
    throw new RefundServiceError("Select at least one order item to refund.", 400, "REFUND_ITEMS_REQUIRED");
  }

  const staff = await assertRefundAccess({ actor, tenantId });
  const order = await getOrderForRefund({ tenantId, orderId });
  ensureOrderCanBeRefunded(order);

  const refundableItems = (order.orderItems || []).filter((item) => !item.refunded);
  if (refundableItems.length === 0) {
    throw new RefundServiceError("All order items have already been refunded.", 400, "ORDER_ITEMS_ALREADY_REFUNDED");
  }

  if (parsedItemIds.length === refundableItems.length) {
    throw new RefundServiceError("Use the full refund endpoint to cancel the whole order.", 400, "USE_FULL_REFUND");
  }

  const itemRefundMap = buildOrderItemRefundMap(order);
  const selectedItems = parsedItemIds.map((itemId) => {
    const item = refundableItems.find((candidate) => candidate.id === itemId);
    if (!item) {
      throw new RefundServiceError(
        `Order item ${itemId} is not refundable or does not belong to this order.`,
        400,
        "ORDER_ITEM_NOT_REFUNDABLE"
      );
    }

    return {
      id: item.id,
      name: item.name || item.productName,
      refundAmount: roundMoney(itemRefundMap.get(item.id) || 0),
    };
  });

  const refundAmount = roundMoney(
    selectedItems.reduce((sum, item) => sum + toNum(item.refundAmount), 0)
  );
  const refundableRemaining = roundMoney(getPaidAmount(order) - toNum(order.refundedAmount));
  if (refundAmount <= 0) {
    throw new RefundServiceError("Selected items do not have any refundable balance left.", 400, "REFUND_AMOUNT_INVALID");
  }

  if (refundAmount > refundableRemaining + 0.01) {
    throw new RefundServiceError("Refund amount exceeds the paid amount remaining on this order.", 400, "REFUND_AMOUNT_EXCEEDED");
  }

  const batchKey = makeBatchKey(order.id);
  const paymentPlans = buildPaymentRefundPlan(order, refundAmount);

  for (const paymentPlan of paymentPlans) {
    const externalResult = await runExternalRefund(paymentPlan.payment, paymentPlan.amount, {
      order,
      reason: trimmedReason,
      batchKey,
    });
    paymentPlan.externalRefundId = externalResult.externalRefundId;
    paymentPlan.providerPayload = externalResult.providerPayload;
  }

  const refundRecords = buildPartialRefundRecords({
    selectedItems,
    paymentPlans,
    reason: trimmedReason,
    tenantId,
    actorId: staff.id,
    batchKey,
  });

  const updatedOrder = await finalizeRefund({
    order,
    refundAmount,
    paymentPlans,
    refundRecords,
    actorId: staff.id,
    nextOrderStatus: "PARTIAL_REFUND",
    itemIdsToMarkRefunded: selectedItems.map((item) => item.id),
    itemStatus: "CANCELLED",
    fullCancellation: false,
  });

  return {
    ok: true,
    batchKey,
    mode: "partial",
    refundAmount,
    refundedItemIds: selectedItems.map((item) => item.id),
    tsePaymentBreakdown: paymentPlans.map((p) => ({
      amount: p.amount,
      method: p.payment.method,
    })),
    order: serializeOrderHistoryEntry(updatedOrder),
  };
}

export async function refundFullOrder({
  tenantId,
  actor,
  orderId,
  reason,
}) {
  const trimmedReason = String(reason || "").trim();
  if (!trimmedReason) {
    throw new RefundServiceError("A refund reason is required.", 400, "REFUND_REASON_REQUIRED");
  }

  const staff = await assertRefundAccess({ actor, tenantId });
  const order = await getOrderForRefund({ tenantId, orderId });
  ensureOrderCanBeRefunded(order);

  const remainingItemIds = (order.orderItems || [])
    .filter((item) => !item.refunded)
    .map((item) => item.id);
  if (remainingItemIds.length === 0) {
    throw new RefundServiceError("This order has already been fully refunded.", 400, "ORDER_ALREADY_REFUNDED");
  }

  const refundAmount = roundMoney(getPaidAmount(order) - toNum(order.refundedAmount));
  if (refundAmount <= 0) {
    throw new RefundServiceError("This order has no refundable balance left.", 400, "REFUND_AMOUNT_INVALID");
  }

  const batchKey = makeBatchKey(order.id);
  const paymentPlans = buildPaymentRefundPlan(order, refundAmount);

  for (const paymentPlan of paymentPlans) {
    const externalResult = await runExternalRefund(paymentPlan.payment, paymentPlan.amount, {
      order,
      reason: trimmedReason,
      batchKey,
    });
    paymentPlan.externalRefundId = externalResult.externalRefundId;
    paymentPlan.providerPayload = externalResult.providerPayload;
  }

  const refundRecords = buildFullRefundRecords({
    order,
    paymentPlans,
    reason: trimmedReason,
    tenantId,
    actorId: staff.id,
    batchKey,
  });

  const updatedOrder = await finalizeRefund({
    order,
    refundAmount,
    paymentPlans,
    refundRecords,
    actorId: staff.id,
    nextOrderStatus: "CANCELLED",
    itemIdsToMarkRefunded: remainingItemIds,
    itemStatus: "CANCELLED",
    fullCancellation: true,
  });

  return {
    ok: true,
    batchKey,
    mode: "full",
    refundAmount,
    refundedItemIds: remainingItemIds,
    tsePaymentBreakdown: paymentPlans.map((p) => ({
      amount: p.amount,
      method: p.payment.method,
    })),
    order: serializeOrderHistoryEntry(updatedOrder),
  };
}

function getRemainingOrderPayment(order) {
  return roundMoney(getPaidAmount(order) - toNum(order.refundedAmount));
}

async function getFallbackAuditActorId(tenantId) {
  const staff = await prisma.tenantAdmin.findFirst({
    where: { tenantId, status: "ACTIVE" },
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (!staff?.id) {
    throw new RefundServiceError("No active staff account exists to record this audit entry.", 500, "AUDIT_ACTOR_MISSING");
  }
  return staff.id;
}

/**
 * First ADMIN/MANAGER for audit when a KDS device runs a paid-order refund (device auth has no staff user).
 */
async function findFirstRefundCapableStaff(tenantId, preferredBranchId) {
  const baseWhere = { tenantId, status: "ACTIVE" };

  if (preferredBranchId) {
    const branchScoped = await prisma.tenantAdmin.findMany({
      where: { ...baseWhere, branchId: preferredBranchId },
      include: { role: true },
      orderBy: { id: "asc" },
    });
    const found = branchScoped.find((s) => canManageRefunds(s.role?.name));
    if (found) return found;
  }

  const tenantWide = await prisma.tenantAdmin.findMany({
    where: baseWhere,
    include: { role: true },
    orderBy: { id: "asc" },
  });
  return tenantWide.find((s) => canManageRefunds(s.role?.name)) || null;
}

/**
 * Kitchen void: order has no customer money left to return (unpaid ticket or already settled).
 * Does not call Stripe/PayPal or create Refund rows.
 */
export async function voidOrderFromKdsNoPayment({
  tenantId,
  orderId,
  reason,
  deviceLabel = "",
}) {
  const trimmedReason = String(reason || "").trim();
  if (!trimmedReason) {
    throw new RefundServiceError("A cancellation reason is required.", 400, "CANCEL_REASON_REQUIRED");
  }

  const order = await prisma.order.findFirst({
    where: { id: Number.parseInt(String(orderId), 10), tenantId },
    include: { orderItems: true, payments: true },
  });

  if (!order) {
    throw new RefundServiceError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  const remaining = getRemainingOrderPayment(order);
  if (remaining > 0.01) {
    throw new RefundServiceError(
      "This order has a captured payment and cannot be voided without processing a refund.",
      400,
      "KDS_REQUIRES_REFUND"
    );
  }

  if (order.status === "CANCELLED") {
    throw new RefundServiceError("Order is already cancelled.", 400, "ORDER_ALREADY_CANCELLED");
  }

  const itemIds = (order.orderItems || []).map((item) => item.id);
  const actorId = await getFallbackAuditActorId(tenantId);
  const note = deviceLabel ? `${trimmedReason} [KDS: ${deviceLabel}]` : `${trimmedReason} [KDS]`;

  await prisma.$transaction(async (tx) => {
    if (itemIds.length > 0) {
      await tx.orderItem.updateMany({
        where: { orderId: order.id, id: { in: itemIds } },
        data: { status: "CANCELLED" },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });

    await tx.auditLog.create({
      data: {
        tenantId,
        actorId,
        action: "KDS_VOID_NO_PAYMENT",
        entityType: "ORDER",
        entityId: order.id,
      },
    });
  });

  return {
    ok: true,
    mode: "kds_void",
    refundAmount: 0,
    orderId: order.id,
    orderNumber: order.orderNumber,
    reason: note,
  };
}

/**
 * KDS cancel entry point: void if no money to return; otherwise full refund (device must be authorized; actor is first ADMIN/MANAGER for audit).
 */
export async function cancelOrderFromKitchenDisplay({
  tenantId,
  orderId,
  reason,
  deviceLabel = "",
}) {
  const order = await prisma.order.findFirst({
    where: { id: Number.parseInt(String(orderId), 10), tenantId },
    include: { payments: true },
  });

  if (!order) {
    throw new RefundServiceError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  const remaining = getRemainingOrderPayment(order);

  if (remaining <= 0.01) {
    return voidOrderFromKdsNoPayment({ tenantId, orderId, reason, deviceLabel });
  }

  const manager = await findFirstRefundCapableStaff(tenantId, order.branchId ?? null);
  if (!manager) {
    throw new RefundServiceError(
      "No ADMIN or MANAGER staff found to record this refund. Add a manager in staff settings or cancel from POS.",
      403,
      "KDS_REFUND_ACTOR_MISSING"
    );
  }

  const baseReason = String(reason || "").trim() || "Order cancelled from KDS";
  const delegatedReason = deviceLabel ? `${baseReason} [KDS: ${deviceLabel}]` : `${baseReason} [KDS]`;

  return refundFullOrder({
    tenantId,
    actor: {
      staffId: manager.id,
      roleName: manager.role?.name,
    },
    orderId,
    reason: delegatedReason,
  });
}

export async function getRefundOrderHistory({
  tenantId,
  branchId = null,
  search = "",
  limit = 20,
}) {
  const parsedLimit = Math.min(100, Math.max(1, Number.parseInt(String(limit || 20), 10) || 20));
  const trimmedSearch = String(search || "").trim();
  const searchOrderId = Number.parseInt(trimmedSearch, 10);

  const fetchCap = Math.min(200, parsedLimit * 4);

  const orders = await prisma.order.findMany({
    where: {
      tenantId,
      ...(branchId ? { branchId } : {}),
      ...(trimmedSearch
        ? {
            OR: [
              { orderNumber: { contains: trimmedSearch, mode: "insensitive" } },
              ...(searchOrderId ? [{ id: searchOrderId }] : []),
            ],
          }
        : {}),
    },
    include: {
      customer: {
        select: { id: true, name: true, phone: true },
      },
      orderItems: {
        orderBy: { id: "asc" },
      },
      payments: {
        orderBy: { id: "asc" },
      },
      refunds: {
        include: {
          actor: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: fetchCap,
  });

  const deduped = dedupeOrderHistoryList(orders, parsedLimit);
  return deduped.map(serializeOrderHistoryEntry);
}

export async function getRefundAnalytics({
  tenantId,
  from = null,
  to = null,
}) {
  const where = {
    tenantId,
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  const refunds = await prisma.refund.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  const byReason = {};
  const byDay = {};
  const byMethod = {};
  let totalRefunded = 0;
  const refundBatches = new Set();
  const fullRefundBatches = new Set();
  const partialRefundBatches = new Set();

  for (const refund of refunds) {
    const amount = roundMoney(toNum(refund.amount));
    const reason = refund.reason || "Unspecified";
    const day = refund.createdAt?.toISOString?.().slice(0, 10) || "unknown";
    const method = refund.paymentMethod || "UNKNOWN";
    const batchKey = refund.batchKey || `refund_${refund.id}`;

    totalRefunded += amount;
    byReason[reason] = roundMoney((byReason[reason] || 0) + amount);
    byDay[day] = roundMoney((byDay[day] || 0) + amount);
    byMethod[method] = roundMoney((byMethod[method] || 0) + amount);
    refundBatches.add(batchKey);

    if (refund.refundType === "FULL_ORDER") {
      fullRefundBatches.add(batchKey);
    } else {
      partialRefundBatches.add(batchKey);
    }
  }

  return {
    totalRefunded: roundMoney(totalRefunded),
    refundCount: refundBatches.size,
    fullRefundCount: fullRefundBatches.size,
    partialRefundCount: partialRefundBatches.size,
    byReason: Object.entries(byReason)
      .map(([reason, amount]) => ({ reason, amount }))
      .sort((a, b) => b.amount - a.amount),
    byDay: Object.entries(byDay)
      .map(([day, amount]) => ({ day, amount }))
      .sort((a, b) => a.day.localeCompare(b.day)),
    byMethod: Object.entries(byMethod)
      .map(([method, amount]) => ({ method, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}
