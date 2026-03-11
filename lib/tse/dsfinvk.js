import { randomUUID } from "crypto";

/**
 * Fiskaly DSFinV-K API – submit Cash Point Closings so they appear in Fiskaly Dashboard.
 * API: https://developer.fiskaly.com/api/dsfinvk/v1
 * Base: https://dsfinvk.fiskaly.com/api/v1
 *
 * Auth uses FISKALY_API_KEY/SECRET. API: PUT /cash_registers/{client_id}, PUT /cash_point_closings/{closing_id}
 */

const DSFINVK_URL = "https://dsfinvk.fiskaly.com/api/v1";
const KASSENSICHV_URL = "https://kassensichv-middleware.fiskaly.com";
const DEBUG = process.env.FISKALY_DEBUG === "1" || process.env.FISKALY_DEBUG === "true";
const log = (...args) => DEBUG && console.log("[DSFinV-K]", ...args);
const logAlways = (...args) => console.log("[DSFinV-K]", ...args);

let _dsfinvkTokenCache = { token: null, expiresAt: 0, key: "" };

async function getDsfinvkToken() {
  const apiKey = process.env.FISKALY_API_KEY?.trim?.() ?? "";
  const apiSecret = process.env.FISKALY_API_SECRET?.trim?.() ?? "";
  const cacheKey = apiKey.slice(0, 8);

  if (_dsfinvkTokenCache.token && _dsfinvkTokenCache.key === cacheKey && Date.now() < _dsfinvkTokenCache.expiresAt - 60_000) {
    return _dsfinvkTokenCache.token;
  }

  let res = await fetch(`${DSFINVK_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
  });
  if (!res.ok) {
    res = await fetch(`${KASSENSICHV_URL}/api/v2/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
    });
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fiskaly auth failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  const token = data.access_token || data.token;
  const expiresIn = (data.access_token_expires_in ?? 600) * 1000;
  _dsfinvkTokenCache = { token, expiresAt: Date.now() + expiresIn, key: cacheKey };
  log("Auth OK");
  return token;
}

/**
 * Ensure Cash Register exists. Creates if needed.
 * API: PUT /api/v1/cash_registers/{client_id}
 */
async function ensureCashRegister(token, clientId) {
  const crId = clientId || "pos-1";
  const url = `${DSFINVK_URL}/cash_registers/${encodeURIComponent(crId)}`;
  const body = {
    cash_register_type: {
      // DSFinV-K expects the SIGN DE link for a MASTER register
      type: "MASTER",
      tss_id: process.env.FISKALY_TSS_ID?.trim?.(),
    },
    brand: process.env.DSFINVK_CASH_REGISTER_BRAND?.trim?.() || "RestaurantSaaS",
    model: process.env.DSFINVK_CASH_REGISTER_MODEL?.trim?.() || "POS-1",
    base_currency_code: process.env.DSFINVK_BASE_CURRENCY?.trim?.() || "EUR",
    software: {
      brand: process.env.DSFINVK_SOFTWARE_BRAND?.trim?.() || "multi_tenant_restaurant_saas_platform",
      version: process.env.DSFINVK_SOFTWARE_VERSION?.trim?.() || null,
    },
  };
  if (!body.cash_register_type.tss_id) {
    throw new Error("Missing FISKALY_TSS_ID (required for DSFinV-K cash register)");
  }
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    log("Cash register upsert:", res.status, err);
    if (res.status >= 400 && res.status < 500) return null;
    throw new Error(`Cash register: ${res.status} ${err}`);
  }
  log("Cash register OK");
  return true;
}

async function getNextCashPointClosingExportId(token, clientId, businessDate) {
  const params = new URLSearchParams({ client_id: clientId, business_date_start: businessDate, business_date_end: businessDate, limit: "100", offset: "0" });
  const res = await fetch(`${DSFINVK_URL}/cash_point_closings?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    // fallback: monotonic-ish value
    return Math.floor(Date.now() / 1000);
  }
  const data = await res.json().catch(() => ({}));
  const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const max = list.reduce((m, c) => Math.max(m, Number(c.cash_point_closing_export_id ?? -1)), -1);
  return (max >= 0 ? max + 1 : 1);
}

/**
 * Submit a Cash Point Closing to Fiskaly so it appears in the dashboard DSFinV-K Exports.
 * @param {Object} opts - { managedOrgId, clientId, businessDate, tseTransactions, cashbookEntries }
 */
export async function submitCashPointClosing(opts) {
  const businessDate = opts.businessDate || new Date().toISOString().slice(0, 10);
  const tseTx = opts.tseTransactions || [];
  const cashbook = opts.cashbookEntries || [];
  const clientId = opts.clientId || "pos-1";

  if (tseTx.length === 0 && cashbook.length === 0) {
    log("No transactions to sync");
    return { ok: true, synced: 0 };
  }

  try {
    const token = await getDsfinvkToken();
    await ensureCashRegister(token, clientId);

    const round2 = (n) => Math.round(Number(n) * 100) / 100;
    const int = (n) => Math.floor(Number(n)) || 0;
    const str40 = (s) => String(s).slice(0, 40);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUuid = (id) => id && typeof id === "string" && uuidRegex.test(id.trim());

    const transactions = [];
    for (const t of tseTx) {
      const amount = round2(t.rawPayload?.amount ?? t.rawPayload?.grandTotal ?? 0);
      const txExportId = str40(String(t.id));
      const ts = new Date(t.signedAt ?? Date.now());
      const tsSec = Math.floor(ts.getTime() / 1000);
      const isStorno = (t.transactionType || "").toUpperCase() === "CANCELLATION";
      const head = {
        type: "Beleg",
        name: "Beleg",
        storno: isStorno,
        number: int(t.id),
        timestamp_start: tsSec,
        timestamp_end: tsSec,
        tx_id: t.fiskalyTxId || `tx-${t.id}`,
        transaction_export_id: txExportId,
      };
      if (isUuid(clientId)) head.closing_client_id = clientId;
      transactions.push({
        head,
        data: {
          full_amount_incl_vat: amount,
          payment_types: [{ type: "Bar", name: "Bar", currency_code: "EUR", amount }],
          amounts_per_vat_id: [{ incl_vat: amount, excl_vat: amount, vat: 0, vat_definition_export_id: 1 }],
          lines: [
            {
              lineitem_export_id: `L-${t.id}-1`,
              storno: isStorno,
              text: "Beleg",
              business_case: {
                type: "Umsatz",
                name: "Beleg",
                amounts_per_vat_id: [{ vat_definition_export_id: 1, excl_vat: amount, vat: 0, incl_vat: amount }],
              },
            },
          ],
        },
        security: isUuid(String(t.fiskalyTxId ?? ""))
          ? { tss_tx_id: String(t.fiskalyTxId) }
          : { error_message: `Missing/invalid SIGN DE tx UUID (got: ${String(t.fiskalyTxId ?? "")})` },
      });
    }
    for (const e of cashbook) {
      const hasTse = tseTx.some((t) => t.cashbookEntryId === e.id);
      if (hasTse) continue;
      const amount = round2(Math.abs(Number(e.amount)));
      const processType = (e.type || "").toUpperCase().includes("WITHDRAWAL") ? "Entnahme" : "Einlage";
      const txExportId = str40(`CB-${e.id}`);
      const ts = new Date(e.createdAt ?? Date.now());
      const tsSec = Math.floor(ts.getTime() / 1000);
      const head = {
        type: "Beleg",
        name: processType,
        storno: false,
        number: int(e.id),
        timestamp_start: tsSec,
        timestamp_end: tsSec,
        tx_id: `cb-${e.id}`,
        transaction_export_id: txExportId,
      };
      if (isUuid(clientId)) head.closing_client_id = clientId;
      transactions.push({
        head,
        data: {
          full_amount_incl_vat: amount,
          payment_types: [{ type: "Bar", name: "Bar", currency_code: "EUR", amount }],
          amounts_per_vat_id: [{ incl_vat: amount, excl_vat: amount, vat: 0, vat_definition_export_id: 1 }],
          lines: [
            {
              lineitem_export_id: `L-CB-${e.id}-1`,
              storno: false,
              text: processType,
              business_case: {
                type: processType === "Entnahme" ? "Auszahlung" : "Einzahlung",
                name: processType,
                amounts_per_vat_id: [{ vat_definition_export_id: 1, excl_vat: amount, vat: 0, incl_vat: amount }],
              },
            },
          ],
        },
        security: { error_message: "TSE signing pending or skipped" },
      });
    }

    const totalAmount = round2(
      transactions.reduce((s, tx) => s + Number(tx.data?.full_amount_incl_vat ?? 0), 0)
    );

    const firstExportId = transactions.length ? transactions[0].head.transaction_export_id : null;
    const lastExportId = transactions.length ? transactions[transactions.length - 1].head.transaction_export_id : null;

    const closingId = randomUUID();
    const cashPointClosingExportId = await getNextCashPointClosingExportId(token, clientId, businessDate);
    const payload = {
      client_id: clientId,
      cash_point_closing_export_id: cashPointClosingExportId,
      head: {
        export_creation_date: Math.floor(Date.now() / 1000),
        first_transaction_export_id: firstExportId,
        last_transaction_export_id: lastExportId,
        ...(businessDate ? { business_date: businessDate } : {}),
      },
      cash_statement: {
        business_cases: [
          // Minimal placeholder (proper VAT allocation can be added later)
          {
            type: "Umsatz",
            name: "Umsatz",
            amounts_per_vat_id: [
              {
                incl_vat: totalAmount,
                excl_vat: totalAmount,
                vat: 0,
                vat_definition_export_id: 1,
              },
            ],
          },
        ],
        payment: {
          full_amount: totalAmount,
          cash_amount: totalAmount,
          cash_amounts_by_currency: [
            {
              currency_code: "EUR",
              amount: totalAmount,
            },
          ],
          payment_types: [
            {
              type: "Bar",
              name: "Bar",
              currency_code: "EUR",
              amount: totalAmount,
            },
          ],
        },
      },
      transactions: Array.isArray(transactions) && transactions.length ? transactions : [],
    };

    const closingUrl = `${DSFINVK_URL}/cash_point_closings/${closingId}`;
    const res = await fetch(closingUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Idempotency-Key": closingId,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      logAlways("Cash Point Closing failed:", res.status, text);
      throw new Error(`DSFinV-K: ${res.status} ${text}`);
    }
    let responseData;
    try {
      responseData = JSON.parse(text);
    } catch (_) {
      responseData = {};
    }
    const state = responseData.state ?? responseData.status;
    const errMsg = responseData.error_message ?? responseData.message ?? responseData.error;
    if (state === "ERROR" || (typeof errMsg === "string" && errMsg.length > 0 && errMsg.includes("SCHEMA"))) {
      const detail = errMsg || responseData.validation_errors || text;
      logAlways("Cash Point Closing rejected (validation):", detail);
      throw new Error(`DSFinV-K validation: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
    }
    // Poll once after short delay to catch async validation (Fiskaly may set state to ERROR after accept)
    const pollOnce = async () => {
      await new Promise((r) => setTimeout(r, 2500));
      const getRes = await fetch(closingUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!getRes.ok) return;
      const body = await getRes.json().catch(() => ({}));
      const s = body.state ?? body.status;
      const e = body.error_message ?? body.message ?? body.error;
      if (s === "ERROR" && e) {
        logAlways("Cash Point Closing async validation failed:", e);
        throw new Error(`DSFinV-K: ${typeof e === "string" ? e : JSON.stringify(e)}`);
      }
    };
    await pollOnce();
    logAlways("Cash Point Closing submitted for", businessDate, "-", transactions.length, "transactions");
    return { ok: true, synced: transactions.length };
  } catch (err) {
    logAlways("DSFinV-K sync error:", err?.message);
    throw err;
  }
}
