/**
 * Fiskaly TSE integration for German fiscal compliance.
 * Uses Fiskaly Middleware API: https://kassensichv-middleware.fiskaly.com
 * Env: FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_TSS_ID
 */

const FISKALY_MIDDLEWARE_URL = "https://kassensichv-middleware.fiskaly.com";

async function getAccessToken() {
  const apiKey = process.env.FISKALY_API_KEY;
  const apiSecret = process.env.FISKALY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("FISKALY_API_KEY and FISKALY_API_SECRET are required for Fiskaly mode");
  }

  const res = await fetch(`${FISKALY_MIDDLEWARE_URL}/api/v2/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      api_secret: apiSecret,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fiskaly auth failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.access_token || data.token;
}

/**
 * Sign a transaction via Fiskaly TSE.
 * @param {Object} payload - { type, orderNumber?, amount?, tenantId?, orderId?, fn? }
 */
export async function fiskalySignTransaction(payload) {
  const tssId = process.env.FISKALY_TSS_ID;
  if (!tssId) {
    throw new Error("FISKALY_TSS_ID is required for Fiskaly mode");
  }

  const token = await getAccessToken();

  const clientId = `pos-${payload.tenantId ?? "default"}`;
  const transactionData = {
    type: payload.type || "SALE",
    data: {
      _fn: payload.fn ?? "Beleg",
      _payload: JSON.stringify({
        orderNumber: payload.orderNumber,
        amount: payload.amount,
        orderId: payload.orderId,
      }),
    },
  };

  const res = await fetch(
    `${FISKALY_MIDDLEWARE_URL}/api/v2/tss/${tssId}/tx`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client_id: clientId,
        ...transactionData,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fiskaly transaction failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  const tx = data.transaction || data;
  return {
    transactionId: tx.transaction_number || tx.id || tx.transaction_id || String(Date.now()),
    signature: tx.signature || tx.signature_value || "",
    timestamp: tx.time_end || tx.timestamp || new Date().toISOString(),
    provider: "fiskaly",
  };
}
