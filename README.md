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
- **POS System:** Point of sale with cart, split payments (Cash, Stripe, PayPal, Card), receipt printing, customer selection
- **Kitchen Display (KDS):** Order workflow (New → Preparing → Ready → Pack → Complete), cancel orders via modal
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
- **Offline payments:** Cash and Card (device) only when offline; Stripe/PayPal require network

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

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_saas"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Fiskaly TSE (German KassenSichV compliance) – see lib/tse/README.md
# FISKALY_API_KEY=
# FISKALY_API_SECRET=
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
npx prisma migrate deploy
npm run db:seed
```

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
| `npm run dev` | Start development server (Prisma generate + Next dev) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:seed` | Seed database with demo data |
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
├── prisma/              # Schema, migrations, seed
└── public/
```

## API Routes

| Endpoint | Purpose |
|----------|---------|
| `/api/auth/[...nextauth]` | NextAuth handlers |
| `/api/pos/order` | Create/fetch POS order |
| `/api/pos/checkout` | Checkout & payments |
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

### Offline mode in Capacitor

- IndexedDB is supported in the WebView.
- `navigator.onLine` and `online` / `offline` events work.
- Offline queue, sync, and indicator behave the same as in the browser.

## Production

1. Set environment variables on your host (Vercel, Railway, etc.):
   - `DATABASE_URL` – production PostgreSQL
   - `NEXTAUTH_URL` – your domain (e.g. `https://your-domain.com`)
   - `NEXTAUTH_SECRET` – same or new strong secret

2. Run migrations and optional seed:

```bash
npx prisma migrate deploy
# npm run db:seed  # only if you want demo data
```

3. Build and start:

```bash
npm run build
npm run start
```

## License

Private.
