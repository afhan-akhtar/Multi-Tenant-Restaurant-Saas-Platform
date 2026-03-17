import {
  assertPayPalConfigured,
  formatMoney,
  getPayPalBaseUrl,
  getPaymentCurrency,
  roundMoney,
} from "@/lib/payments/config";

async function getPayPalAccessToken() {
  assertPayPalConfigured();

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Failed to authenticate with PayPal.");
  }

  return data.access_token;
}

async function paypalRequest(path, { method = "GET", body } = {}) {
  const token = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data?.details?.[0]?.description ||
      data?.message ||
      "PayPal request failed.";
    throw new Error(message);
  }

  return data;
}

function buildCustomId({ tenantId, branchId, staffId, checkoutSessionId }) {
  return `tenant:${tenantId}|branch:${branchId}|staff:${staffId}|checkout:${checkoutSessionId || ""}`;
}

export async function createPosPayPalOrder({
  amount,
  tenantId,
  branchId,
  staffId,
  checkoutSessionId,
}) {
  const currency = getPaymentCurrency();
  const normalizedAmount = roundMoney(amount);

  return paypalRequest("/v2/checkout/orders", {
    method: "POST",
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `pos-${Date.now()}`,
          custom_id: buildCustomId({ tenantId, branchId, staffId, checkoutSessionId }),
          description: "Restaurant POS payment",
          amount: {
            currency_code: currency,
            value: formatMoney(normalizedAmount),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    },
  });
}

export async function capturePosPayPalOrder(orderId, context = {}) {
  return paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    body: {},
  });
}

export async function getPayPalOrder(orderId) {
  return paypalRequest(`/v2/checkout/orders/${orderId}`);
}

export async function verifyCapturedPayPalOrder({
  orderId,
  captureId,
  expectedAmount,
  tenantId,
  branchId,
  staffId,
  checkoutSessionId,
}) {
  const currency = getPaymentCurrency();
  const order = await getPayPalOrder(orderId);
  const purchaseUnit = order.purchase_units?.[0];
  const capture = purchaseUnit?.payments?.captures?.find((item) => item.id === captureId);

  if (order.status !== "COMPLETED") {
    throw new Error("PayPal payment is not completed.");
  }

  if (!purchaseUnit || !capture) {
    throw new Error("PayPal capture was not found on the approved order.");
  }

  if (
    purchaseUnit.custom_id !==
    buildCustomId({ tenantId, branchId, staffId, checkoutSessionId })
  ) {
    throw new Error("PayPal payment does not belong to this POS session.");
  }

  if (capture.status !== "COMPLETED") {
    throw new Error("PayPal capture is not completed.");
  }

  if (capture.amount?.currency_code !== currency) {
    throw new Error("PayPal payment currency does not match POS currency.");
  }

  if (roundMoney(capture.amount?.value) !== roundMoney(expectedAmount)) {
    throw new Error("PayPal payment amount does not match checkout split.");
  }

  return { order, capture };
}

export async function refundPayPalCapture(captureId) {
  return paypalRequest(`/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    body: {},
  });
}
