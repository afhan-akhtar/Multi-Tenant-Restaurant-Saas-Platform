# POS and KDS Device Workflow

This document explains the full no-login POS and KDS device flow in this project, including provisioning, authentication, routing, real-time updates, and how the system is expected to be used in a real restaurant environment.

## Purpose

The project supports two different ways to use POS and KDS:

- Dashboard mode for logged-in restaurant staff
- Device mode for dedicated hardware screens that should work without login

Device mode is designed for real restaurant operations such as:

- a cashier POS terminal at the front counter
- a kitchen tablet or TV for the main kitchen
- a drinks station KDS
- a packing or expeditor screen

Once a device is provisioned, the screen can be opened directly with a secure link and used without opening the admin dashboard again.

## Main Building Blocks

The device flow is built on these project areas:

- `prisma/schema.prisma`
- `lib/device-auth.js`
- `lib/devices.js`
- `app/api/devices/route.js`
- `app/api/devices/[id]/route.js`
- `app/api/devices/[id]/regenerate/route.js`
- `app/api/kds/screens/route.js`
- `app/api/kds/screens/[id]/route.js`
- `app/pos/[tenantId]/page.js`
- `app/kds/[tenantId]/page.js`
- `app/api/kds/live/route.js`
- `app/api/kds/stream/route.js`
- `app/components/DevicesManagement.js`
- `app/components/KDS.js`

## Core Concepts

### 1. DeviceToken

Each dedicated POS or KDS screen is represented by a `DeviceToken` record in the database.

A device stores:

- tenant relationship
- branch relationship
- optional KDS screen relationship
- device type: `POS` or `KDS`
- name
- hashed token
- status: `ACTIVE` or `DISABLED`
- `lastSeenAt`

Important security rule:

- the plain token is never stored in the database
- only the hashed token is stored
- the raw token is shown only once when the device is created or regenerated

### 2. KDSScreen

KDS devices can optionally be assigned to a `KDSScreen`.

A screen represents a kitchen destination such as:

- `MAIN`
- `DRINKS`
- `GRILL`
- `FRYER`
- `PACKING`
- `EXPEDITOR`
- `DESSERT`
- `CUSTOM`

This allows the project to move from one shared kitchen screen per branch to a more professional station-based kitchen model.

### 3. Public Device Routes

Dedicated devices do not use dashboard URLs. They use public routes:

- POS: `/pos/[tenantId]?token=...`
- KDS: `/kds/[tenantId]?token=...`

These routes are intentionally marked as public in `middleware.js`, so they can be opened without a staff session.

## Full Provisioning Flow

## Step 1: Restaurant Admin Logs Into Dashboard

Only a logged-in restaurant admin can create or manage devices.

Typical flow:

1. Open `/login`
2. Sign in with restaurant staff credentials
3. Open the `Devices` page from the dashboard sidebar

This page is rendered from:

- `app/[restaurant]/devices/page.js`
- `app/(main)/devices/page.js`

The UI itself lives in:

- `app/components/DevicesManagement.js`

## Step 2: Admin Creates KDS Screens

Before creating a professional KDS device, the admin can create one or more KDS screens.

Example screens:

- `Kitchen Main Screen`
- `Drinks Station`
- `Packing Screen`
- `Expeditor Screen`

When the admin clicks `Add KDS Screen`, the UI sends a request to:

- `POST /api/kds/screens`

The API validates:

- the user is a logged-in tenant staff user
- the branch belongs to the tenant
- the station type is valid

The screen is stored in `KDSScreen`.

## Step 3: Admin Creates Device

When the admin clicks `Add Device`, the UI sends a request to:

- `POST /api/devices`

The admin chooses:

- device name
- device type: `POS` or `KDS`
- branch
- optional KDS screen for KDS devices

The backend then:

1. validates tenant staff auth
2. validates branch ownership
3. resolves the selected screen or branch default screen
4. generates a long random raw token
5. hashes the token
6. stores only the hash in the database
7. creates the `DeviceToken` record
8. returns:
   - the device data
   - the raw token
   - the full device URL

The device URL is built with:

- `getAbsoluteDeviceUrl()` in `lib/device-auth.js`

Example returned links:

- `http://localhost:3000/pos/1?token=...`
- `http://localhost:3000/kds/1?token=...`

## Step 4: Admin Copies Link to Device

After creation, the UI shows a modal containing:

- the raw token
- the final device URL

This is the one-time setup step for the physical screen.

Typical real-world use:

- copy POS link to front counter PC or tablet
- copy KDS link to kitchen tablet, TV browser, or kiosk browser

Once the device link is placed on the hardware, daily staff do not need to log in.

## Step 5: Device Opens Without Login

When the device opens its URL, the relevant page validates the token server-side.

### POS Device Flow

Route:

- `app/pos/[tenantId]/page.js`

What happens:

1. page reads `tenantId` from the route
2. page reads `token` from query params
3. `validateDeviceAccess()` checks:
   - tenant id
   - token hash
   - device type `POS`
   - device status `ACTIVE`
4. if valid, POS data is loaded with `getPOSData()`
5. the `POS` component is rendered with `deviceAuth`

If invalid:

- access denied screen is shown

### KDS Device Flow

Route:

- `app/kds/[tenantId]/page.js`

What happens:

1. page reads `tenantId` and `token`
2. `validateDeviceAccess()` checks:
   - tenant id
   - token hash
   - device type `KDS`
   - device status `ACTIVE`
3. initial KDS orders are loaded
4. a signed stream ticket is created for real-time updates
5. the `KDS` component is rendered in `device` mode

If invalid:

- access denied screen is shown

## Device Authentication Internals

The device auth system is centralized in:

- `lib/device-auth.js`

It provides:

- `hashDeviceToken()`
- `generateDeviceTokenValue()`
- `validateDeviceAccess()`
- `getRequestActor()`
- `createDeviceSocketTicket()`
- `verifyDeviceSocketTicket()`

### Two Auth Modes

Most backend APIs now support two actor types:

- `staff`
- `device`

`getRequestActor()` first tries a normal NextAuth session. If none exists, it checks device headers:

- `x-device-token`
- `x-tenant-id`
- `x-device-type`

This means the same backend can serve:

- logged-in dashboard users
- dedicated no-login devices

## How POS Sends Requests Without Login

The POS page passes `deviceAuth` into client components.

Client requests include device headers through:

- `lib/device-client.js`

That allows no-login POS requests to call APIs such as:

- `/api/pos/order`
- `/api/pos/checkout`
- `/api/customers`
- payment routes

The server authenticates these requests as a valid POS device instead of a normal staff session.

## How KDS Gets Orders Without Login

The KDS device uses two mechanisms:

- initial data load
- live sync

### Initial Load

The page fetches current kitchen orders using:

- `getKDSOrders(tenantId, branchId, screenId)`

This returns:

- branch-wide orders for standard KDS
- screen-filtered orders for station-specific KDS devices

### Live Sync

The KDS component uses:

- `GET /api/kds/stream` for SSE
- `GET /api/kds/live` as fallback sync

The flow is:

1. KDS page generates a signed stream ticket
2. browser opens EventSource connection
3. server validates ticket or device headers
4. server subscribes device to KDS events
5. client receives live updates
6. client also polls periodically as a resilience layer

This is handled mainly by:

- `app/api/kds/stream/route.js`
- `app/api/kds/live/route.js`
- `app/components/KDS.js`
- `lib/realtime-hub.js`

## Real-Time Order Flow

The overall order flow is:

1. cashier uses POS device
2. POS creates or checks out an order
3. backend saves order
4. backend creates KDS routing entries
5. backend broadcasts KDS event
6. KDS devices receive update
7. KDS UI refreshes automatically

The main order APIs are:

- `app/api/pos/order/route.js`
- `app/api/pos/checkout/route.js`

When an order is created:

- the order is stored
- order items are stored
- KDS routing entries are created in `KDSItem`
- a live event is broadcast

## Station-Based KDS Routing

This project now includes the foundation for professional station routing.

### Product Routing

Products can store a `kdsStation` value such as:

- `MAIN`
- `DRINKS`
- `DESSERT`

### Routing Logic

The routing logic is handled in:

- `lib/kds-routing.js`

When a POS order is created:

1. product station metadata is read
2. matching KDS screens for the branch are found
3. `KDSItem` rows are created per order item and screen
4. KDS devices assigned to a screen only see relevant routed items

This is the bridge from simple branch-wide KDS to a more enterprise kitchen model.

## Status Updates and Cancellation

KDS devices can update order state through:

- `PATCH /api/kds/order`

They can also cancel through:

- `POST /api/orders/cancel`

When statuses change:

- order status is updated
- routed `KDSItem` statuses are updated
- a real-time event is broadcast

This keeps multiple KDS views synchronized.

## Last Seen

Every time a valid device token is used successfully, `validateDeviceAccess()` updates:

- `lastSeenAt`

This helps the admin monitor whether a device is active and recently connected.

## Token Rotation

If a device is lost, replaced, or should no longer be trusted, the admin can regenerate its token.

UI action:

- `Regenerate Link`

API:

- `POST /api/devices/[id]/regenerate`

What happens:

1. a new raw token is generated
2. old token hash is replaced
3. device stays active
4. a new URL is returned
5. old URL stops working

## Disable and Delete

### Disable

Disabling a device changes its status to `DISABLED`.

Result:

- its URL remains the same
- but token validation fails
- device can no longer access POS or KDS

### Delete

Deleting removes the device record completely.

Use delete when the device should no longer exist in the system.

## Example Real Restaurant Setup

A realistic production-style setup might look like this:

- `Front Counter POS 1` -> POS device for cashier
- `Front Counter POS 2` -> second cashier POS
- `Kitchen Main Screen` -> branch default KDS
- `Drinks Station Screen` -> drinks KDS
- `Packing Screen` -> expeditor or packing station

Daily usage:

1. admin provisions each device once
2. each screen opens its assigned device URL
3. cashier enters order on POS
4. kitchen sees order instantly
5. stations work independently
6. expeditor or final station tracks completion

## Dashboard Mode vs Device Mode

### Dashboard Mode

- requires login
- used by admins and staff
- accessible through tenant dashboard routes
- good for management and back-office workflows

### Device Mode

- no login required after provisioning
- optimized for fixed hardware devices
- opened directly by secure tokenized URL
- better for always-on restaurant terminals

## Demo Mode vs Real Provisioning

The project still seeds demo POS and KDS links for quick testing, but the intended production flow is:

1. admin logs in
2. admin creates screen
3. admin creates device
4. admin copies secure one-time device link
5. restaurant hardware runs on that link

This is the correct professional setup for a no-login operational environment.

## Summary

The POS and KDS device system works like this:

- admin provisions devices in the dashboard
- each device gets a secure tokenized public link
- the device opens POS or KDS without login
- the backend authenticates using device tokens instead of a staff session
- KDS receives live updates through SSE and polling
- branch and screen assignment allow progressive movement toward a professional station-based kitchen workflow

For subdomain routing and tenant URL behavior, see:

- `docs/SUBDOMAIN_FUNCTIONALITY.md`
