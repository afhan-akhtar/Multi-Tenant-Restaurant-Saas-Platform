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
- **Staff & Security:** Staff management, roles & permissions
- **Floor:** Dining tables management
- **Billing:** Subscription view
- **Reporting:** Dashboard, reports, Z-reports, cashbook
- **CRM/Marketing:** Segments, loyalty program, email campaigns, customer management (parties)

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
| Restaurant Admin | [/login](http://localhost:3000/login) | staff@demo.com | staff123 (subdomain: **demo**) |

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
