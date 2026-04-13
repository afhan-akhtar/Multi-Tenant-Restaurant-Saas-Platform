# Multi Tenant Restaurant SaaS Platform

A full-stack SaaS platform for restaurant management with multi-tenant support. Built with Next.js 14, PostgreSQL, and Prisma.

## Features

### Super Admin (Platform Governance)
- Restaurant/tenant management (approve, block, unblock)
- Subscription plans & tenant subscriptions
- Commission & billing
- Global audit logs
- Tenant impersonation for support

### Restaurant Admin
- **Menu Engineering:** Categories, products with variants, add-on groups
- **POS System:** Point of sale with cart, split payments (Cash, Stripe, PayPal), real Stripe checkout, real PayPal order/capture, receipt printing, customer selection
- **Kitchen Display (KDS):** Order workflow (New Arrived → Cooking → Ready → Dispatched), cancel orders via modal
- **Tenant Admins & Security:** Tenant admin management, roles & permissions
- **Floor:** Dining tables management
- **Billing:** Subscription view
- **Reporting:** Dashboard, reports, Z-reports, cashbook
- **CRM/Marketing:** Segments, loyalty program, email campaigns, customer management (parties)

### Offline Mode & Resilience (99% Uptime SLA) — §6.8
- **Local database:** IndexedDB for offline order queue (SQLite-style persistent storage in browser/WebView)
- **Order queue:** POS queues checkout when internet is unavailable
- **Auto-sync:** Queued orders sync automatically when connection is restored
- **Conflict resolution:** Server assigns order numbers on sync; failed syncs can be retried
- **Offline indicator:** UI badge shows connection status and queued count
- **Offline payments:** Cash only when offline; Stripe/PayPal require network

#### How Offline Mode Works (Technical)

**IndexedDB, not localStorage**

We use **IndexedDB** (not `localStorage`) for offline storage:

| Feature | **IndexedDB** (used) | **localStorage** |
|---------|----------------------|------------------|
| Type | Asynchronous database | Key-value string store |
| Size | Large (~50MB+) | Small (~5–10MB) |
| Data | Objects, arrays, blobs | Strings only |
| Structure | Tables & indexes | Flat key-value |

**Storage structure**

- **Database:** `pos-offline-db`
- **Table (object store):** `queued_orders`
- **Each record:** `id`, `payload` (items, splits, etc.), `status`, `createdAt`, `updatedAt`

Data is stored in the user's browser and persists across reloads and browser restarts.

**Offline checkout flow**

```
User clicks "Confirm Payment"
        ↓
isOnline() → false
        ↓
queueOrder(payload) → IndexedDB.add(record)
        ↓
Cart clears, toast: "Order queued for sync"
```

**Sync when connection returns**

```
window "online" event fires
        ↓
syncQueuedOrders()
        ↓
For each queued order:
  fetch("/api/pos/checkout", body: record.payload)
  If success → remove from IndexedDB
  If fail → mark status = "FAILED" (stays for retry)
```

**Network detection**

- `navigator.onLine` – browser reports online/offline status
- `window.addEventListener("online" | "offline")` – fires when connection changes; auto-sync triggers on `online`

**How to inspect**

In Chrome DevTools: **Application** tab → **Storage** → **IndexedDB** → `pos-offline-db` → `queued_orders` to view stored records.

**Web + Capacitor (Android/iOS):** IndexedDB works in both browser and Capacitor WebView. Same codebase, no changes. See [Mobile Apps (Capacitor)](#mobile-apps-capacitor) below.

### Authentication
- Super Admin login at `/admin`
- Restaurant Admin login at `/login` (email + subdomain)
- Tenant self-registration at `/register` (creates PENDING tenant; requires Super Admin approval)
- NextAuth with credentials & impersonation providers

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Charts:** Recharts

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd multi_tenant_restaurant_saas_platform
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your local credentials.

**Database (two logical databases on PostgreSQL)**

| Variable | Required | Purpose |
|----------|----------|---------|
| `PLATFORM_DATABASE_URL` | **Yes** (or use `DATABASE_URL`) | Control-plane DB: tenant registry, billing, super admin, staff login index. |
| `DATABASE_URL` | Fallback | If `PLATFORM_DATABASE_URL` is unset, used for the platform DB and as a base URL for deriving per-tenant DB names in dev. |
| `TENANT_DATABASE_URL` | For CLI only | Used by `prisma db push` / `migrate` for the **tenant** schema (`prisma/tenant/prisma.config.ts`). Point at any tenant database URL when running those commands. |
| `DATABASE_ADMIN_URL` | Optional | Connection to the `postgres` maintenance database (same host/user as platform). Used by `CREATE DATABASE` when provisioning tenant DBs. Defaults from `PLATFORM_DATABASE_URL` / `DATABASE_URL`. |

**Auth and app**

```env
# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# POS Payments (optional, but required for Stripe/PayPal checkout)
PAYMENTS_CURRENCY="EUR"
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
PAYPAL_ENV="sandbox"
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""

# Fiskaly TSE (German KassenSichV compliance) – see lib/tse/README.md
# FISKALY_API_KEY=
# FISKALY_API_SECRET=
```

Example local URLs (adjust user, password, host, port):

```env
PLATFORM_DATABASE_URL="postgresql://postgres:password@localhost:5432/restaurant_platform"
# Tenant DBs are separate databases on the same server, e.g. restaurant_tenant_1
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Payment Provider Setup

Stripe and PayPal are now fully wired into the POS flow instead of being saved as placeholder payment labels.

- **Stripe:** add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **PayPal:** add `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- **Currency:** set `PAYMENTS_CURRENCY` (defaults to `EUR`)
- **Sandbox vs live:** set `PAYPAL_ENV=sandbox` for testing or `PAYPAL_ENV=live` in production

When provider credentials are missing, the POS automatically disables the related payment option and continues to allow Cash/Card checkout.

### 3. Database setup (local)

The app uses a **platform** database plus **one database per restaurant tenant**.

1. **Generate Prisma clients** (required after install or schema changes):

```bash
npm run db:generate
```

2. **Create the platform database** and apply the platform schema (this repo may not include migration folders yet; `db push` is fine for development):

```bash
npm run db:platform:push
```

3. **Seed** — creates the super admin, registers the `demo` tenant, **provisions** the tenant database (`restaurant_tenant_<id>`), mirrors the tenant row, loads demo menu/orders, and inserts subscription/billing rows on the platform:

```bash
npm run db:seed
```

If you only need to (re)create a tenant database and apply the tenant schema without running the full seed, use:

```bash
npm run db:provision-tenant -- 1
```

(`1` is the platform `Tenant.id`.)

When you add proper `prisma/platform/migrations` and `prisma/tenant/migrations`, replace `db push` with `npx prisma migrate deploy` using the same `--schema` / `--config` as in `package.json` scripts.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials (after seed)

| Role | URL | Email | Password |
|------|-----|-------|----------|
| Super Admin | [/admin](http://localhost:3000/admin) | admin@platform.com | admin123 |
| Restaurant Admin | [/login](http://localhost:3000/login) | tenant@demo.com | tenant123 (subdomain: **demo**) |

Restaurant Admin redirects to `/demo` after login.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Generate Prisma clients and start the dev server |
| `npm run build` | Generate clients and production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate both platform and tenant Prisma clients |
| `npm run db:platform:push` | Push platform schema to `PLATFORM_DATABASE_URL` |
| `npm run db:seed` | Seed platform + demo tenant DB (provisions tenant DB if missing) |
| `npm run db:provision-tenant` | Create/migrate a single tenant database by platform tenant id |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/
│   ├── (main)/          # Restaurant dashboard routes (/, /pos, /products, etc.)
│   ├── [restaurant]/    # Dynamic tenant routes (/{subdomain}/...)
│   ├── admin/           # Super Admin panel
│   ├── api/             # API routes
│   ├── login/           # Restaurant login
│   ├── register/        # Tenant self-registration
│   └── go/              # Post-login redirect handler
├── app/components/      # React components (POS, KDS, Dashboard, etc.)
├── lib/                 # Auth, DB, POS logic, dashboard, etc.
├── prisma/              # `platform/` + `tenant/` schemas; `seed.mjs`
└── public/
```

## API Routes

| Endpoint | Purpose |
|----------|---------|
| `/api/auth/[...nextauth]` | NextAuth handlers |
| `/api/pos/order` | Create/fetch POS order |
| `/api/pos/checkout` | Checkout & payments |
| `/api/payments/config` | POS payment provider availability |
| `/api/payments/stripe/create-intent` | Create Stripe payment intent for POS |
| `/api/payments/paypal/create-order` | Create PayPal order for POS |
| `/api/payments/paypal/capture-order` | Capture approved PayPal POS order |
| `/api/kds/order` | KDS order status update |
| `/api/orders/cancel` | Cancel order |
| `/api/products` | Products CRUD |
| `/api/categories` | Categories CRUD |
| `/api/addons` | Add-on groups |
| `/api/customers` | Customers CRUD |
| `/api/tables` | Tables CRUD |
| `/api/settings` | Tenant settings |
| `/api/register` | Tenant registration |
| `/api/admin/*` | Admin: plans, subscriptions, impersonate |
| `/api/super-admin/tenants` | Super Admin tenant management |

## Mobile Apps (Capacitor)

Build Android and iOS apps from the same Next.js web app using [Capacitor](https://capacitorjs.com). Offline mode (IndexedDB) works in the WebView without any code changes.

### Stable tablet URL (recommended — no LAN IP in the app)

The Capacitor **`server.url`** should point at a **fixed HTTPS host** (your deployed Next app), not a changing `192.168.x.x` address:

1. Deploy the app (e.g. Vercel) so you have something like `https://your-project.vercel.app`.
2. Set `server.url` to **`https://your-project.vercel.app/tablet/connect`** (sync into `capacitor.config.json` or edit by hand), then `npx cap sync` and rebuild the APK/IPA.
3. On first open, staff use **Admin → Devices → TABLET** and paste either the **full link** or **device token only** on the connect screen. The token is stored on the device; you are not tied to a local IP for daily use.

For **local Wi‑Fi testing**, run `npm run cap:sync` so `scripts/cap-set-dev-url.js` writes your current LAN IP; the default path is now **`/tablet/connect`** (not a hardcoded `/tablet?token=…`). Paste the **device token** once; avoid relying on a bookmarked LAN URL.

### Setup

1. Install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

2. When prompted:
   - **App name:** Restaurant POS (or your choice)
   - **App ID:** com.yourcompany.restaurant-pos
   - **Web asset directory:** `out` (or `dist` — see deployment options)

3. Add platforms:

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### Deployment options

**Option A — WebView loads deployed URL (recommended)**

Deploy the Next.js app (e.g. Vercel). The Capacitor app loads that URL in a WebView:

- In `capacitor.config.ts` add: `server: { url: 'https://your-app.vercel.app', cleartext: true }`
- All features (POS, KDS, offline) work as in the browser.
- IndexedDB, fetch, auth — same behaviour as web.

**Option B — Bundled web assets**

Build with `next build` and copy output. API must run on a server; more setup required.

### Build & run

```bash
npm run build
npx cap sync
npx cap open android   # or: npx cap open ios
```

### Real Android/iPhone on the same Wi‑Fi (dev server)

`ERR_CONNECTION_REFUSED` means the phone could not open a TCP connection to your computer on port 3000. Check:

1. **Start the Next dev server** on your machine: `npm run dev` (uses `server.js` and listens on `0.0.0.0:3000`).
2. **Same network:** phone and computer on the same Wi‑Fi (not guest/cellular-only).
3. **Refresh the URL in the app:** run `npm run cap:sync` (it runs `scripts/cap-set-dev-url.js`, which writes your current LAN IP into `capacitor.config.json`). Then open Android Studio / reinstall the app if needed.
4. **Quick test:** on the phone’s browser, open `http://YOUR_LAN_IP:3000` — you should see the site. If that fails, fix IP/firewall before debugging the Capacitor app.
5. **macOS Firewall:** allow incoming connections for **Node** (or temporarily turn the firewall off to test).
6. **`.env` and `HOST`:** If you have **`HOST=localhost`** or **`HOST=127.0.0.1`**, remove it for LAN testing (older setups used that for the HTTP bind and blocked other devices). This project’s `server.js` uses **`LISTEN_HOST=0.0.0.0`** by default so phones can connect; Next.js uses **`NEXT_DEV_HOSTNAME=localhost`** internally.

**Android emulator:** the script falls back to `10.0.2.2` when no LAN IP is found (emulator → host). Override with `CAP_SERVER_HOST=10.0.2.2 npm run cap:sync`.

### Offline mode in Capacitor

- IndexedDB is supported in the WebView.
- `navigator.onLine` and `online` / `offline` events work.
- Offline queue, sync, and indicator behave the same as in the browser.

## Production

1. Set environment variables on your host (Vercel, Railway, etc.):
   - `PLATFORM_DATABASE_URL` – production PostgreSQL database for the control plane (or `DATABASE_URL` as fallback)
   - `NEXTAUTH_URL` – your domain (e.g. `https://your-domain.com`)
   - `NEXTAUTH_SECRET` – strong secret
   - `DATABASE_ADMIN_URL` – optional; needed if the app creates tenant databases at runtime

2. Run migrations for **platform** and **tenant** schemas (when migration folders exist), provision per-tenant databases, then build:

```bash
npx prisma migrate deploy --schema=prisma/platform/schema.prisma
# For each tenant DB, set TENANT_DATABASE_URL and run migrate deploy with prisma/tenant config — see lib/provision-tenant-database.js
npm run build
```

3. Start:

```bash
npm run start
```

Do not run `db:seed` in production unless you intend to load demo accounts and data.

## License

Private.
