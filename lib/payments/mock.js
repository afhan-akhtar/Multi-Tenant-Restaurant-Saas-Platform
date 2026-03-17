import { getPaymentCurrency, toMinorUnits } from "@/lib/payments/config";

function buildMockRef(prefix, { tenantId, branchId, staffId, amount }) {
  return [
    prefix,
    String(tenantId),
    String(branchId),
    String(staffId),
    String(toMinorUnits(amount)),
    String(Date.now()),
  ].join("_");
}

function parseMockRef(ref, prefix) {
  const parts = String(ref || "").split("_");
  if (parts.length < 7) return null;

  const parsedPrefix = parts.slice(0, prefix.split("_").length).join("_");
  if (parsedPrefix !== prefix) return null;

  const offset = prefix.split("_").length;
  return {
    tenantId: Number(parts[offset]),
    branchId: Number(parts[offset + 1]),
    staffId: Number(parts[offset + 2]),
    amountMinor: Number(parts[offset + 3]),
  };
}

function assertMockMatch(parsed, { tenantId, branchId, staffId, expectedAmount }) {
  if (!parsed) {
    throw new Error("Mock payment reference is invalid.");
  }

  if (
    parsed.tenantId !== Number(tenantId) ||
    parsed.branchId !== Number(branchId) ||
    parsed.staffId !== Number(staffId)
  ) {
    throw new Error("Mock payment does not belong to this POS session.");
  }

  if (parsed.amountMinor !== toMinorUnits(expectedAmount)) {
    throw new Error("Mock payment amount does not match checkout split.");
  }
}

export function createMockStripePaymentIntent(context) {
  const id = buildMockRef("pi_mock", context);
  return {
    id,
    client_secret: `${id}_secret_mock`,
    amount_received: toMinorUnits(context.amount),
    currency: getPaymentCurrency().toLowerCase(),
    status: "succeeded",
    metadata: {
      integration: "restaurant_pos",
      tenantId: String(context.tenantId),
      branchId: String(context.branchId),
      staffId: String(context.staffId),
    },
  };
}

export function verifyMockStripePaymentIntent({
  paymentIntentId,
  expectedAmount,
  tenantId,
  branchId,
  staffId,
}) {
  const parsed = parseMockRef(paymentIntentId, "pi_mock");
  assertMockMatch(parsed, { tenantId, branchId, staffId, expectedAmount });

  return {
    id: paymentIntentId,
    amount_received: parsed.amountMinor,
    currency: getPaymentCurrency().toLowerCase(),
    status: "succeeded",
    metadata: {
      integration: "restaurant_pos",
      tenantId: String(tenantId),
      branchId: String(branchId),
      staffId: String(staffId),
    },
  };
}

export function createMockPayPalOrder(context) {
  return {
    id: buildMockRef("paypal_order_mock", context),
    status: "CREATED",
  };
}

export function captureMockPayPalOrder(context) {
  const captureId = buildMockRef("paypal_capture_mock", context);
  return {
    id: context.orderId,
    status: "COMPLETED",
    purchase_units: [
      {
        custom_id: `tenant:${context.tenantId}|branch:${context.branchId}|staff:${context.staffId}`,
        payments: {
          captures: [
            {
              id: captureId,
              status: "COMPLETED",
              amount: {
                currency_code: getPaymentCurrency(),
                value: (toMinorUnits(context.amount) / 100).toFixed(2),
              },
            },
          ],
        },
      },
    ],
  };
}

export function verifyMockPayPalCapture({
  orderId,
  captureId,
  expectedAmount,
  tenantId,
  branchId,
  staffId,
}) {
  const parsedOrder = parseMockRef(orderId, "paypal_order_mock");
  const parsedCapture = parseMockRef(captureId, "paypal_capture_mock");

  assertMockMatch(parsedOrder, { tenantId, branchId, staffId, expectedAmount });
  assertMockMatch(parsedCapture, { tenantId, branchId, staffId, expectedAmount });

  return {
    order: {
      id: orderId,
      status: "COMPLETED",
      purchase_units: [
        {
          custom_id: `tenant:${tenantId}|branch:${branchId}|staff:${staffId}`,
        },
      ],
    },
    capture: {
      id: captureId,
      status: "COMPLETED",
      amount: {
        currency_code: getPaymentCurrency(),
        value: (toMinorUnits(expectedAmount) / 100).toFixed(2),
      },
    },
  };
}
