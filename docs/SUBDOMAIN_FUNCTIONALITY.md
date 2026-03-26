# Subdomain Functionality

This document explains how subdomains work in this project, how tenant URLs are built, how middleware routes requests, and how restaurant staff are redirected to their own tenant space.

## Purpose

The application is multi-tenant. Each restaurant tenant has its own identity and should feel like it has its own isolated dashboard.

This project supports that by using tenant subdomains, for example:

- `demo.localhost:3000`
- `restaurant1.example.com`
- `pizza-house.example.com`

Instead of keeping restaurant dashboards under plain path-based URLs only, the platform routes tenant traffic to the correct tenant host.

## Main Files Involved

The subdomain system is mainly handled by:

- `lib/tenant-url.js`
- `middleware.js`
- `lib/auth.js`
- `app/go/page.js`
- `app/[restaurant]/layout.js`
- `app/(main)/layout.js`

## Key Idea

Each `Tenant` record has a `subdomain` field in the database.

Example:

- tenant name: `Demo Restaurant`
- subdomain: `demo`

This subdomain is used to construct the tenant URL:

- local example: `http://demo.localhost:3000`
- production example: `https://demo.yourdomain.com`

## URL Helpers

The helper file `lib/tenant-url.js` contains the core URL logic.

### `getHostInfo(host)`

This function inspects the incoming host and extracts:

- hostname
- port
- root host
- root hostname
- subdomain
- whether the current request is already on a tenant host

Examples:

### Example 1

Input:

- `localhost:3000`

Output meaning:

- root host is `localhost:3000`
- no tenant subdomain
- this is not a tenant host

### Example 2

Input:

- `demo.localhost:3000`

Output meaning:

- root hostname is `localhost`
- subdomain is `demo`
- this is a tenant host

### Example 3

Input:

- `demo.example.com`

Output meaning:

- root hostname is `example.com`
- subdomain is `demo`
- this is a tenant host

### `buildTenantHost(host, subdomain)`

Builds the tenant host from a base/root host and tenant subdomain.

Examples:

- root host `localhost:3000` + subdomain `demo` -> `demo.localhost:3000`
- root host `example.com` + subdomain `pizza` -> `pizza.example.com`

### `buildTenantUrl({ host, protocol, subdomain, pathname })`

Builds the full tenant URL.

Examples:

- `http://demo.localhost:3000/products`
- `https://demo.example.com/reports`

### `buildRootUrl({ host, protocol, pathname })`

Builds a non-tenant root URL for shared platform pages such as:

- `/admin`
- `/register`

### `getTenantInternalPath(subdomain, pathname)`

Used when middleware rewrites tenant-host requests into the internal route structure.

Example:

- host: `demo.localhost:3000`
- browser pathname: `/products`
- internal rewritten pathname: `/demo/products`

The user still sees the clean tenant-host URL in the browser, but the app resolves it through the internal `[restaurant]` route tree.

## Reserved Root Segments

The project keeps a list of root segments that should never be treated as tenant subdomains.

Examples:

- `admin`
- `api`
- `login`
- `register`
- `pos`
- `kds`
- `settings`
- `products`

This prevents conflicts where a normal platform route might accidentally be interpreted as a tenant name.

The reserved segment list is defined in:

- `lib/tenant-url.js`

## Middleware Behavior

The main routing logic lives in:

- `middleware.js`

This middleware decides:

- whether the request is public
- whether the user should be redirected
- whether the request should be rewritten to an internal tenant route
- whether a path-based tenant URL should be converted to a subdomain URL

## Request Flow Cases

### Case 1: Old Path-Based Tenant URL

Example request:

- `http://localhost:3000/demo/products`

Middleware detects:

- first path segment is `demo`
- `demo` is not a reserved root segment
- request is not already on a tenant host

Result:

- redirect to `http://demo.localhost:3000/products`

This means old path-style tenant URLs are normalized into proper subdomain URLs.

### Case 2: Request Already on Tenant Host

Example request:

- `http://demo.localhost:3000/products`

Middleware detects:

- current host has subdomain `demo`
- request is already on tenant host

Result:

- request is internally rewritten to `/demo/products`

The user keeps seeing `demo.localhost:3000/products`, but Next.js resolves it through the `app/[restaurant]` route group.

### Case 3: Staff Logged In on Root Host

Example:

- restaurant admin logs in on `http://localhost:3000/login`

If the session belongs to a restaurant staff user and the tenant subdomain is `demo`, middleware redirects the user to:

- `http://demo.localhost:3000/`

This keeps staff inside their own tenant host.

### Case 4: Staff Logged In on Wrong Tenant Host

Example:

- logged-in staff belongs to `demo`
- user opens `http://another.localhost:3000/products`

Middleware detects mismatch:

- current subdomain is `another`
- session subdomain is `demo`

Result:

- redirect to the correct tenant host:
  - `http://demo.localhost:3000/products`

### Case 5: Super Admin on Tenant Host

If a super admin lands on a tenant host, middleware redirects them back to root admin.

Example:

- `http://demo.localhost:3000/...`

Redirect:

- `http://localhost:3000/admin`

This keeps super admin and tenant routing separated.

### Case 6: Tenant Login Page

If the request is:

- `http://demo.localhost:3000/login`

Middleware rewrites the request to the tenant internal login path and sets a special header:

- `x-restaurant-login: 1`

This helps the layout know that the request is for the login page and should not apply the normal authenticated dashboard wrapper.

## Authentication and Subdomains

Authentication logic lives in:

- `lib/auth.js`

The credentials provider supports:

- `email`
- `password`
- optional `subdomain`

There are two restaurant staff login modes:

### Mode 1: Email + Password + Subdomain

If the login form includes a subdomain, the backend:

1. finds the tenant with that subdomain
2. verifies the tenant is active
3. finds the staff user inside that tenant
4. verifies the password
5. creates a session containing tenant context

### Mode 2: Email + Password Only

If no subdomain is provided, the backend:

1. searches staff accounts across active tenants
2. verifies password
3. returns the matching tenant user

In both cases, the session stores:

- `tenantId`
- `tenantName`
- `subdomain`
- `branchId`
- role information

The `subdomain` becomes critical for redirects and host enforcement later.

## Post-Login Redirect

The route:

- `app/go/page.js`

acts as the post-login router.

Its job is:

- super admin -> redirect to `/admin`
- restaurant staff -> redirect to tenant subdomain root

Example:

- logged-in staff subdomain: `demo`
- current host: `localhost:3000`
- result: redirect to `http://demo.localhost:3000/`

## Tenant Layout Resolution

The tenant layout lives in:

- `app/[restaurant]/layout.js`

This layout:

1. checks session
2. checks the `restaurant` route param
3. ensures it matches the logged-in user's subdomain
4. loads subscription access
5. renders the normal dashboard layout

This is how the app ensures a user cannot simply jump into another tenant path.

## Main Layout vs Tenant Layout

### `app/(main)/layout.js`

This layout handles non-tenant dashboard paths on the root host.

If a restaurant staff user lands there, it redirects them to their proper tenant URL.

### `app/[restaurant]/layout.js`

This layout handles the tenant-scoped dashboard after middleware rewrite.

In practice:

- browser URL can be `demo.localhost:3000/products`
- internally the app resolves it through `app/[restaurant]/products/...`

## Why This Approach Is Good

This architecture gives several benefits:

- cleaner tenant isolation
- more professional SaaS URL structure
- easier mental model for restaurant users
- simple way to support tenant-specific branding and behavior later
- compatibility with both local development and production custom domains

## Local Development Setup

For local development, the project supports subdomains under `localhost`.

Examples:

- root platform: `http://localhost:3000`
- tenant dashboard: `http://demo.localhost:3000`

Important note:

- many browsers support `*.localhost`
- if your environment blocks this, you may need local DNS or hosts-file support depending on your machine and browser setup

## Production Setup

In production, the same logic works with a real root domain.

Example:

- root domain: `example.com`
- tenant subdomain: `demo`
- tenant URL: `https://demo.example.com`

To make this work in production, infrastructure must support wildcard subdomains, such as:

- DNS wildcard record
- platform routing for `*.example.com`
- cookie configuration aligned with root domain

## Cookie Domain Behavior

The auth system computes a cookie domain in `lib/auth.js`.

This is important because the session should be usable across:

- root host
- tenant subdomains

The code checks values such as:

- `ROOT_DOMAIN`
- `NEXT_PUBLIC_ROOT_DOMAIN`
- `NEXTAUTH_URL`

Special handling exists for:

- `localhost`
- `.localhost`
- normal production domains

This allows the auth cookies to work correctly in a multi-subdomain environment.

## Public Routes and Subdomains

Some routes are public and bypass login requirements in middleware, such as:

- `/login`
- `/register`
- `/receipt/...`
- `/pos/...`
- `/kds/...`
- `/api/auth/...`

Important distinction:

- dashboard routes are tenant-aware and session-driven
- device routes such as `/pos/[tenantId]` and `/kds/[tenantId]` are token-driven

These device routes are not subdomain-based. They are designed for hardware access without relying on tenant host login flow.

## Example End-to-End Journey

### Tenant Creation

1. tenant is created in database
2. tenant gets subdomain, for example `demo`

### Staff Login

1. staff logs in with `tenant@demo.com`
2. session stores `subdomain = demo`
3. app redirects user to `demo.localhost:3000` or `demo.example.com`

### Daily Usage

1. staff opens `demo.localhost:3000/products`
2. middleware confirms tenant host
3. request is internally rewritten to `/demo/products`
4. `app/[restaurant]` route handles the page
5. user works entirely inside their own tenant domain

## Summary

The subdomain system works by combining:

- tenant `subdomain` data from the database
- URL helper functions in `lib/tenant-url.js`
- request routing logic in `middleware.js`
- session-based tenant enforcement in `lib/auth.js`
- post-login tenant redirect in `app/go/page.js`
- tenant-scoped route rendering in `app/[restaurant]/layout.js`

In short:

- each tenant has its own subdomain
- middleware converts old path-style URLs to subdomain URLs
- logged-in staff are forced onto the correct tenant host
- tenant-host requests are internally rewritten to the `[restaurant]` route tree
- super admin stays on root admin routes

For POS and KDS device provisioning and no-login device access, see:

- `docs/POS_KDS_DEVICE_WORKFLOW.md`
