/**
 * Fiskaly TSE integration – German only (SIGN DE / KassenSichV).
 * API: https://developer.fiskaly.com/api/kassensichv/v2
 *
 * Uses only the German KassenSichV API. No Spain/SIGN ES or other products.
 * Supports: env credentials (platform) or TenantFiskalyConfig (multi-tenant).
 * TSS + client provisioned via POST /api/tse/setup.
 */

import { prisma } from "@/lib/db";

const FISKALY_MIDDLEWARE_URL = "https://kassensichv-middleware.fiskaly.com";
const DEBUG = process.env.FISKALY_DEBUG === "1" || process.env.FISKALY_DEBUG === "true";

const log = (...args) => DEBUG && console.log("[Fiskaly]", ...args);
const logAlways = (...args) => console.log("[Fiskaly]", ...args);

let _tokenCache = { accessToken: null, expiresAt: 0 };
let _clientIdCache = null;

const TYPE_MAP = {
  SALE: "RECEIPT",
  RECEIPT: "RECEIPT",
  CANCELLATION: "CANCELLATION",
  PAYMENT: "RECEIPT",
  DEPOSIT: "RECEIPT",
  WITHDRAWAL: "RECEIPT",
};

async function getAccessToken(cred = {}) {
  const apiKey = (cred.apiKey ?? process.env.FISKALY_API_KEY)?.trim?.() ?? "";
  const apiSecret = (cred.apiSecret ?? process.env.FISKALY_API_SECRET)?.trim?.() ?? "";
  const cacheKey = apiKey?.slice(0, 8) ?? "env";

  if (_tokenCache.accessToken && _tokenCache.key === cacheKey && Date.now() < _tokenCache.expiresAt - 60_000) {
    log("Auth: using cached token");
    return _tokenCache.accessToken;
  }

  log("Auth: fetching new token");
  const res = await fetch(`${FISKALY_MIDDLEWARE_URL}/api/v2/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status} ${err}`);
  }

  const data = await res.json();
  const token = data.access_token || data.token;
  const expiresIn = (data.access_token_expires_in ?? 600) * 1000;
  _tokenCache = { accessToken: token, expiresAt: Date.now() + expiresIn, key: cacheKey };
  log("Auth: token obtained");
  return token;
}

/**
 * Get a valid client_id (UUID). Uses provided clientId or fetches from API.
 */
async function getClientId(tssId, tenantId, token, cred = {}) {
  const providedClientId = cred.clientId;
  if (providedClientId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(providedClientId)) {
    return providedClientId;
  }
  if (_clientIdCache) return _clientIdCache;

  log("Client: listing (path: /api/v2/tss/{id}/client)");
  const listRes = await fetch(
    `${FISKALY_MIDDLEWARE_URL}/api/v2/tss/${tssId}/client`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!listRes.ok) {
    const err = await listRes.text();
    throw new Error(`${listRes.status} ${err}`);
  }

  const data = await listRes.json();
  const clients = Array.isArray(data) ? data : data.data || data.clients || [];
  const client = clients.find((c) => (c.serial_number || "").includes("pos")) || clients[0];
  const clientId = client?._id ?? client?.client_id;
  if (clientId) {
    _clientIdCache = clientId;
    log("Client: using", _clientIdCache);
    return _clientIdCache;
  }

  // No clients exist – create one via PUT
  const newClientId = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; const v = c === "x" ? r : (r & 0x3 | 0x8); return v.toString(16); });
  const serialNumber = "pos-1";
  logAlways("Client: creating new client", newClientId, "serial_number:", serialNumber);
  const createRes = await fetch(
    `${FISKALY_MIDDLEWARE_URL}/api/v2/tss/${tssId}/client/${newClientId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ serial_number: serialNumber }),
    }
  );
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`${createRes.status} ${errText}`);
  }
  _clientIdCache = newClientId;
  logAlways("Client: created and using", _clientIdCache);
  return _clientIdCache;
}

/** Resolve Fiskaly credentials. TSS+client come from API (setup), never from env. */
async function resolveCred(tenantId) {
  const apiKey = process.env.FISKALY_API_KEY?.trim?.() || process.env.FISKALY_API_KEY;
  const apiSecret = process.env.FISKALY_API_SECRET?.trim?.() || process.env.FISKALY_API_SECRET;

  // 1. Per-tenant config (from POST /api/tse/setup with tenantId)
  if (tenantId != null) {
    try {
      const row = await prisma.tenantFiskalyConfig.findUnique({
        where: { tenantId: Number(tenantId) },
      });
      if (row?.tssId && row?.clientId && row?.apiKey && row?.apiSecret) {
        return {
          apiKey: row.apiKey,
          apiSecret: row.apiSecret,
          tssId: row.tssId,
          clientId: row.clientId,
        };
      }
    } catch (e) {
      log("Tenant Fiskaly config fetch failed:", e?.message);
    }
  }

  // 2. Platform default: env apiKey+secret, TSS+client from FiskalyPlatformConfig
  if (apiKey && apiSecret) {
    try {
      const row = await prisma.fiskalyPlatformConfig.findUnique({
        where: { apiKey },
      });
      if (row?.tssId && row?.clientId) {
        return {
          apiKey,
          apiSecret,
          tssId: row.tssId,
          clientId: row.clientId,
        };
      }
      // Auto-provision: run setup and save
      const { setupFiskalyTSS } = await import("./fiskalySetup.js");
      const result = await setupFiskalyTSS(apiKey, apiSecret);
      await prisma.fiskalyPlatformConfig.upsert({
        where: { apiKey },
        create: {
          apiKey,
          tssId: result.tssId,
          clientId: result.clientId,
          adminPuk: result.adminPuk ?? null,
        },
        update: {
          tssId: result.tssId,
          clientId: result.clientId,
          adminPuk: result.adminPuk ?? undefined,
        },
      });
      logAlways("Platform TSE auto-provisioned:", result.tssId);
      return {
        apiKey,
        apiSecret,
        tssId: result.tssId,
        clientId: result.clientId,
      };
    } catch (e) {
      if (process.env.FISKALY_SKIP_WHEN_UNAVAILABLE === "1") {
        throw new Error("TSE_SKIP_SOFT");
      }
      throw e;
    }
  }

  throw new Error("401 Missing FISKALY_API_KEY or FISKALY_API_SECRET");
}

/**
 * Fiskaly upsertTransaction per API spec:
 * PUT /api/v2/tss/{tss_id}/tx/{tx_id}?tx_revision=N
 * https://developer.fiskaly.com/api/kassensichv/v2#operation/upsertTransaction
 *
 * Flow: 1) ACTIVE (no schema), 2) ACTIVE (with schema.raw), 3) FINISHED
 */
export async function fiskalySignTransaction(payload) {
  const cred = await resolveCred(payload.tenantId);
  const tssId = cred.tssId;
  if (!tssId) {
    throw new Error("400 Missing tssId");
  }

  logAlways("Transaction: starting", payload.type, payload.fn, "order#", payload.orderNumber);

  const token = await getAccessToken(cred);
  const clientId = await getClientId(tssId, payload.tenantId, token, cred);

  const txId = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const receiptType = TYPE_MAP[payload.type?.toUpperCase()] ?? "RECEIPT";
  const processPayload = JSON.stringify({
    orderNumber: payload.orderNumber,
    amount: payload.amount,
    orderId: payload.orderId,
    fn: payload.fn,
  });
  const processDataB64 = Buffer.from(processPayload, "utf8").toString("base64");
  const processType = receiptType === "CANCELLATION" ? "Storno-V1" : "Kassenbeleg-V1";

  const baseUrl = `${FISKALY_MIDDLEWARE_URL}/api/v2/tss/${tssId}/tx/${txId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const put = async (revision, body) => {
    const res = await fetch(`${baseUrl}?tx_revision=${revision}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`${res.status} ${text}`);
    }
    return text ? JSON.parse(text) : {};
  };

  try {
    log("Tx step 1: start ACTIVE");
    await put(1, { state: "ACTIVE", client_id: clientId });

    log("Tx step 2: update with schema");
    await put(2, {
      state: "ACTIVE",
      client_id: clientId,
      schema: {
        raw: {
          process_type: processType,
          process_data: processDataB64,
        },
      },
    });

    log("Tx step 3: finish");
    const final = await put(3, {
      state: "FINISHED",
      client_id: clientId,
      schema: {
        raw: {
          process_type: processType,
          process_data: processDataB64,
        },
      },
    });

    const tx = final.transaction ?? final;
    const logEntry = Array.isArray(tx.log) ? tx.log[tx.log.length - 1] : tx.log ?? tx;
    const sig = logEntry?.signature ?? tx?.signature;
    const sigVal = (typeof sig === "object" && sig !== null && (sig.value ?? sig.signature))
      ? (sig.value ?? sig.signature)
      : (typeof tx?.signature === "string" ? tx.signature : "");
    const qrCodeData = tx.qr_code_data ?? logEntry?.qr_code_data ?? "";
    let signature = typeof sigVal === "string" ? sigVal : "";
    let timestamp = tx.time_end ?? logEntry?.time_end ?? tx.timestamp;
    if (!signature && qrCodeData) {
      const parts = qrCodeData.split(";");
      if (parts.length >= 10) signature = parts.slice(-2).join(";");
    }
    if (typeof timestamp === "number") {
      timestamp = timestamp > 1e12 ? new Date(timestamp).toISOString() : new Date(timestamp * 1000).toISOString();
    }
    if (qrCodeData) {
      const parts = qrCodeData.split(";");
      if (parts.length >= 8 && /^\d{4}-\d{2}-\d{2}T/.test(parts[7])) timestamp = parts[7];
    }
    const result = {
      transactionId: String(tx.number ?? tx.transaction_number ?? tx.id ?? txId),
      signature: signature || qrCodeData,
      timestamp: timestamp || new Date().toISOString(),
      tssSerialNumber: tx.tss_serial_number ?? logEntry?.tss_serial_number,
      qrCodeData: qrCodeData || null,
      provider: "fiskaly",
    };
    logAlways("Transaction: OK", { txId: result.transactionId, sig: result.signature?.slice(0, 24) + "…" });
    return result;
  } catch (err) {
    throw err;
  }
}
