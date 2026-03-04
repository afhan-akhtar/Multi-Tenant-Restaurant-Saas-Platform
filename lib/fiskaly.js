/**
 * TSE (Technische Sicherheitseinrichtung) integration via Fiskaly for German fiscal compliance.
 * Every order, cancellation, and payment must be signed.
 * Configure FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_TSS_ID for production.
 */

const FISKALY_MIDDLEWARE = "https://kassensichv-middleware.fiskaly.com";

export async function signTransaction(params) {
  const { orderId, type, payload } = params;
  const apiKey = process.env.FISKALY_API_KEY;
  const apiSecret = process.env.FISKALY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return {
      ok: true,
      sandbox: true,
      signature: `SANDBOX-${orderId}-${Date.now()}`,
      fiskalyTxId: `sandbox-tx-${orderId}`,
    };
  }

  try {
    const res = await fetch(`${FISKALY_MIDDLEWARE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        tss_id: process.env.FISKALY_TSS_ID || "default",
        type: type || "SALE",
        payload: payload || { order_id: orderId, timestamp: new Date().toISOString() },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Fiskaly TSE error: ${err}`);
    }

    const data = await res.json();
    return {
      ok: true,
      sandbox: false,
      signature: data.signature || data.transaction_id,
      fiskalyTxId: data.transaction_id || data.id,
    };
  } catch (err) {
    console.error("[fiskaly] sign error:", err);
    throw err;
  }
}

/**
 * Sign order + all payments as one fiscal transaction (KassensichV compliant).
 * Single signature covers order, items, and payment breakdown.
 */
export async function signOrder(orderId, orderData) {
  return signTransaction({
    orderId,
    type: "SALE",
    payload: {
      order_id: orderId,
      timestamp: new Date().toISOString(),
      total: orderData.grandTotal,
      items_count: orderData.itemsCount,
      payments: orderData.payments || [],
    },
  });
}

export async function signCancellation(orderId, reason) {
  return signTransaction({
    orderId,
    type: "REVERSAL",
    payload: {
      order_id: orderId,
      timestamp: new Date().toISOString(),
      reason: reason || "cancellation",
    },
  });
}
