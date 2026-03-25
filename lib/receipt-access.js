import crypto from "crypto";

const RECEIPT_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required for receipt access tokens.");
  }
  return secret;
}

export function createReceiptAccessToken({ orderId, tenantId, expiresInMs = RECEIPT_TOKEN_TTL_MS }) {
  const payload = {
    orderId: Number.parseInt(String(orderId), 10),
    tenantId: Number.parseInt(String(tenantId), 10),
    exp: Date.now() + expiresInMs,
  };

  if (!payload.orderId || !payload.tenantId) {
    throw new Error("Invalid receipt access payload.");
  }

  const payloadString = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadString).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payloadString)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyReceiptAccessToken(token) {
  try {
    const [payloadB64, signature] = String(token || "").split(".");
    if (!payloadB64 || !signature) return null;

    const payloadString = Buffer.from(payloadB64, "base64url").toString("utf8");
    const expectedSignature = crypto
      .createHmac("sha256", getSecret())
      .update(payloadString)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(payloadString);
    if (!payload?.orderId || !payload?.tenantId) {
      return null;
    }

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
