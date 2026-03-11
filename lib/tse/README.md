# Fiskaly TSE Integration (German only – KassenSichV)

German fiscal compliance only. Uses [Fiskaly SIGN DE API V2](https://developer.fiskaly.com/api/kassensichv/v2). API keys must be from a SIGN DE organization (not Spain/SIGN ES or fiskaly.Receipt).

## API Reference

- **Technical Security System**: [Fiskaly TSS API](https://developer.fiskaly.com/api/kassensichv/v2#tag/Technical-Security-System)
- **Base URL (Middleware)**: `https://kassensichv-middleware.fiskaly.com` – auth, transactions, clients
- **Base URL (Backend)**: `https://kassensichv.fiskaly.com` – TSS creation, exports
- **Receipt data / Beleg**: [Beleg Daten](https://developer.fiskaly.com/de/sign-de/receipt-data)

## Flow

1. **Auth**: `POST /api/v2/auth` with `api_key`, `api_secret`
2. **TSS + Client**: provisioned via `POST /api/tse/setup` (uses `PUT /api/v2/tss/{id}`, `PUT /api/v2/tss/{tss_id}/client/{client_id}`)
3. **Transaction**: `PUT /api/v2/tss/{tss_id}/tx/{tx_id}?tx_revision=N` – 3 steps:
   - `tx_revision=1`: `state: "ACTIVE"`, no schema
   - `tx_revision=2`: `state: "ACTIVE"`, `schema.raw` with `process_type`, `process_data` (base64)
   - `tx_revision=3`: `state: "FINISHED"`

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `FISKALY_API_KEY` | Yes | From dashboard.fiskaly.com |
| `FISKALY_API_SECRET` | Yes | From dashboard.fiskaly.com |
| `FISKALY_SKIP_WHEN_UNAVAILABLE` | No | `1` = skip TSE when limit/config blocks (dev) |
| `FISKALY_DEBUG` | No | `1` = verbose logs |

## Endpoints

- `POST /api/tse/setup` – provision TSS + client
- `GET /api/tse/test` – test connectivity
- `GET /api/tse/status` – diagnose org/TSS state
- `GET /api/tse/dsfinvk` – DS-FinV-K export (JSON, CSV, or ZIP with index.xml)

## Fiskaly Dashboard sync

To see your deposits and transactions in the Fiskaly Dashboard:

1. Click **"Sync to Fiskaly"** on the Cashbook page after deposits/withdrawals (submits a Cash Point Closing to Fiskaly).
2. In the dashboard go to **DSFinV-K → Cash Point Closings** to confirm entries; then **DSFinV-K → DSFinV-K Exports** → **TRIGGER DSFINV-K EXPORT** → Download.

If the cash register in the dashboard shows a **UUID** (e.g. `92c7d144-55d7-412b-9b41-e162e6gebed1`), set that as the client ID so sync and closings match:

- `DSFINVK_CLIENT_ID=92c7d144-55d7-412b-9b41-e162e6gebed1` (use the ID from **DSFinV-K → Cash Registers**)

Exports appear only after Cash Point Closings are submitted via the Sync button or API.

## Integrations

- **Cash deposits & withdrawals**: `/api/cashbook/deposit`, `/api/cashbook/withdrawal` – each entry is TSE-signed via Fiskaly
- **DS-FinV-K export**: In-app `?format=json|csv|zip`; or use Fiskaly Dashboard for official export
- **TSE auto-migration**: Daily cron `GET /api/cron/tse-migrate` (Vercel: 2:00 UTC) retries failed TSE signings – no auth required
