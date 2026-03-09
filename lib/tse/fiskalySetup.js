/**
 * Fiskaly TSS + Client provisioning – German only (SIGN DE / KassenSichV).
 * API: https://developer.fiskaly.com/api/kassensichv/v2
 *
 * Uses only the German KassenSichV API. API keys must be from a SIGN DE org
 * (not Spain/SIGN ES or fiskaly.Receipt). Create keys at dashboard.fiskaly.com
 * in an org that shows Technical Security Systems, Clients, Transactions.
 *
 * Flow: Auth → List TSS → Create TSS (if needed) → Init → Create client
 */

const MIDDLEWARE_URL = "https://kassensichv-middleware.fiskaly.com";
const BACKEND_URL = "https://kassensichv.fiskaly.com";

function uuid() {
  return typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

function randomPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function auth(apiKey, apiSecret, useBackend = false) {
  const key = (apiKey || "").trim();
  const secret = (apiSecret || "").trim();
  const base = useBackend ? BACKEND_URL : MIDDLEWARE_URL;
  const res = await fetch(`${base}/api/v2/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: key, api_secret: secret }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token || data.token;
}

async function listTss(token) {
  const res = await fetch(`${MIDDLEWARE_URL}/api/v2/tss`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  const data = text ? JSON.parse(text) : {};
  return data.data || [];
}

async function listClients(token, tssId) {
  const res = await fetch(`${MIDDLEWARE_URL}/api/v2/tss/${tssId}/client`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || data.clients || [];
}

/**
 * Create TSS via Backend (per Fiskaly docs: "Create TSS" uses Backend).
 * Backend may return UNINITIALIZED; Middleware often returns CREATED.
 */
async function createTss(token, tssId) {
  const res = await fetch(`${BACKEND_URL}/api/v2/tss/${tssId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  const data = text ? JSON.parse(text) : {};
  return {
    tssId: data._id || tssId,
    adminPuk: data.admin_puk,
    state: data.state,
  };
}

async function changeAdminPin(token, tssId, adminPuk, newAdminPin) {
  const res = await fetch(`${MIDDLEWARE_URL}/api/v2/tss/${tssId}/admin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ admin_puk: adminPuk, new_admin_pin: newAdminPin }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
}

async function authAdmin(token, tssId, adminPin) {
  const res = await fetch(`${MIDDLEWARE_URL}/api/v2/tss/${tssId}/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ admin_pin: adminPin }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
}

async function patchTssState(token, tssId, state) {
  const res = await fetch(`${MIDDLEWARE_URL}/api/v2/tss/${tssId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ state }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
}

async function createClient(token, tssId, clientId, serialNumber = "pos-1") {
  const res = await fetch(
    `${MIDDLEWARE_URL}/api/v2/tss/${tssId}/client/${clientId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ serial_number: serialNumber }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return clientId;
}

/**
 * Full setup: ensure TSS and client exist. Uses only apiKey + apiSecret.
 * Returns { tssId, clientId, adminPuk?, adminPin? }
 */
export async function setupFiskalyTSS(apiKey, apiSecret, options = {}) {
  const { serialNumber = "pos-1" } = options;

  const token = await auth(apiKey, apiSecret);
  let tssList = await listTss(token);

  // 1. Find any TSS that already has a client (works for UNINITIALIZED, INITIALIZED, or CREATED)
  for (const tss of tssList) {
    const clients = await listClients(token, tss._id);
    const client = clients[0];
    if (client) {
      const clientId = client._id ?? client.client_id;
      return {
        tssId: tss._id,
        clientId,
        adminPuk: null,
        adminPin: null,
      };
    }
  }

  // 2. TSS in UNINITIALIZED/INITIALIZED but no client – add one
  let tssId, adminPuk, adminPin;
  const addableTss = tssList.find(
    (t) => t.state === "UNINITIALIZED" || t.state === "INITIALIZED"
  );
  if (addableTss) {
    tssId = addableTss._id;
    const clientId = uuid();
    await createClient(token, tssId, clientId, serialNumber);
    return { tssId, clientId, adminPuk: null, adminPin: null };
  }

  // 3a. CREATED TSS + FISKALY_ADMIN_PUK – try to initialize (API rejects CREATED; fall back to 3b)
  const envPuk = process.env.FISKALY_ADMIN_PUK?.trim?.();
  const envTssId = process.env.FISKALY_TSS_ID?.trim?.();
  const createdTss = tssList.find((t) => t.state === "CREATED" && (!envTssId || t._id === envTssId));
  if (createdTss && envPuk) {
    try {
      tssId = createdTss._id;
      adminPuk = envPuk;
      adminPin = randomPin();
      await patchTssState(token, tssId, "UNINITIALIZED");
      await changeAdminPin(token, tssId, adminPuk, adminPin);
      await authAdmin(token, tssId, adminPin);
      await patchTssState(token, tssId, "INITIALIZED");
      const clientId = uuid();
      await createClient(token, tssId, clientId, serialNumber);
      return { tssId, clientId, adminPuk, adminPin };
    } catch (e) {
      if (/E_TSS_CREATED|UNINITIALIZED|INITIALIZED/.test(e?.message || "")) {
        // PUK init not supported for CREATED via API – create new TSS instead
      } else {
        throw e;
      }
    }
  }

  // 3b. Create new TSS (fails if limit reached)
  tssId = uuid();
  const backendToken = await auth(apiKey, apiSecret, true);
  const created = await createTss(backendToken, tssId);
  adminPuk = created.adminPuk;
  tssId = created.tssId;

  if (!adminPuk) {
    throw new Error(JSON.stringify({ state: created.state, admin_puk: adminPuk }));
  }

  adminPin = randomPin();
  if (created.state === "CREATED") {
    await patchTssState(token, tssId, "UNINITIALIZED");
  }
  await changeAdminPin(token, tssId, adminPuk, adminPin);
  await authAdmin(token, tssId, adminPin);
  await patchTssState(token, tssId, "INITIALIZED");

  const clientId = uuid();
  await createClient(token, tssId, clientId, serialNumber);

  return { tssId, clientId, adminPuk, adminPin };
}
