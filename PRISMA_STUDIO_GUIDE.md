## Prisma Studio vs Frontend – What to Manage Where

This document is for the client so it is clear which things should be managed via the **database (Prisma Studio / backend)** and which things must be handled only through the **POS / frontend UI**.

Below you will find recommendations for each main model / entity.

---

## 1. Super Admin / Platform Level

- **`SuperAdmin`**
  - **Where to manage**: Only from backend / seed data. **The client should NOT change this via Prisma Studio.**
  - **Reason**: This is the global admin for the platform owner; changing this can break the multi-tenant structure and security.

- **`FiskalyPlatformConfig`**
  - **Where to manage**: Only by the backend / dev team (Prisma Studio or migrations), **not by the client**.
  - **Use**: Global FISKALY API key & TSS information. This is platform-wide configuration.

- **`Permission`**
  - **Where to manage**: Dev team / super admin, set once via Prisma migrations or Prisma Studio.
  - **From frontend?**: No. Permission codes are tied to the codebase and should stay under developer control.

- **`SubscriptionPlan`**
  - **Recommended**: Platform owner / dev team manage these in Prisma Studio (create / update plans).
  - **Frontend**: The client should normally only see a listing of available plans; no direct write access to this model.

---

## 2. Tenant Level (Restaurant / Brand)

- **`Tenant`**
  - **Create**: Usually via an onboarding flow (frontend + API). If needed, the dev team can manually add a tenant in Prisma Studio.
  - **Update**: 
    - **Normal fields** (`name`, `subdomain`, `country`, `logoUrl`, `status`) – should be editable from the frontend (tenant settings page).
    - **Prisma Studio usage**: Only for emergencies or data repair.

- **`TenantFiskalyConfig`**
  - **Sensitive config**: API key, secret, `tssId`, `clientId`, tax numbers.
  - **Recommended**: This config should either:
    - Come from a secure onboarding form (frontend + API, stored securely), or
    - Be set by the dev team in Prisma Studio when the tenant is onboarded.
  - **Do NOT**: Expose this model as editable to normal client users in the frontend.

- **`TenantSubscription`**
  - **Create / Update**:
    - If billing is handled via Stripe or other external systems, these records should be created/updated automatically by the backend.
    - Prisma Studio should be used only for manual corrections / testing.
  - **Frontend**: The client should see subscription info as **read-only**.

---

## 3. Branch & Staff Setup

- **`Branch`**
  - **Purpose**: Multiple branches / locations for each tenant.
  - **Where to manage**:
    - **Frontend (recommended)**: Branch management screen (create/update/delete).
    - **Prisma Studio**: Only when the dev team needs to seed data or perform deep fixes.

- **`Role` & `RolePermission`**
  - **Role**: Tenant-specific roles (Manager, Waiter, Cashier, etc.).
  - **RolePermission**: Mapping which permissions belong to which role.
  - **Recommended**:
    - If you want the client to have flexible RBAC, build a **Role & RolePermission management UI** in the frontend (create roles, assign permissions).
    - If roles are fixed (e.g. only 3–4 static roles), let the dev team manage them via **Prisma Studio / seeds**, and have the frontend only read them.

- **`Staff`**
  - **Where to manage**: 
    - **Frontend (strongly recommended)**: Staff management page (add/edit staff, assign branch/role, activate/deactivate).
    - **Prisma Studio**: Only for manual fixes (e.g. email typo, emergency password reset).
  - **Reason**: Staff onboarding is part of operational workflow owned by HR/management, not by developers.

---

## 4. Menu Management (Categories, Products, Variants, Addons)

This area is used daily by the **restaurant manager / admin**, so there should definitely be a **proper frontend UI**. Prisma Studio should be used here only as backup / for emergencies.

- **`Category`**
  - **Client responsibilities**: 
    - Create/update/delete categories from the frontend.
    - Manage parent/child hierarchy (sub-categories) via the frontend UI.
  - **Prisma Studio**: Only when the structure is corrupted or for bulk-import scripts.

- **`Product`**
  - **Fields**: `name`, `description`, `plu`, `basePrice`, `taxRate`, `imageUrl`, `allergens`, `dietaryFlags`, `isActive`, `categoryId`.
  - **Frontend**:
    - Add/edit products (price, tax, description, image, etc.).
    - Assign a product to a category.
    - Toggle `isActive` to hide/show products in the menu.
  - **Prisma Studio**:
    - Bulk updates (e.g. price migrations).
    - Data repairs.

- **`ProductVariant`**
  - **Example**: Small/Medium/Large, different sizes, etc.
  - **Frontend**:
    - Add/edit/delete variants from the product detail screen.
  - **Prisma Studio**:
    - Bulk changes or quick manual fixes, but normal operations should go through the UI.

- **`AddonGroup` & `AddonItem`**
  - **AddonGroup**: e.g. "Extra Toppings", "Sauces".
  - **AddonItem**: e.g. "Cheese", "BBQ Sauce", "Ketchup" + price.
  - **Frontend**:
    - Tenant admin creates addon groups and sets min/max selection via UI.
    - Add/edit addon items via UI.
  - **Prisma Studio**:
    - Bulk import / initial setup, or occasional fixes.

---

## 5. Tables, Sessions & Orders (Live Operations)

- **`DiningTable`**
  - **Fields**: `name`, `seats`, `status`, `branchId`, `tenantId`.
  - **Frontend**:
    - Manage tables (add/edit/delete) from a table management UI.
    - Status (`AVAILABLE`, `OCCUPIED`, `RESERVED`) should be handled automatically based on sessions and orders.
  - **Prisma Studio**:
    - Only when a table is incorrectly created or when the structure must be adjusted manually.

- **`Session`**
  - **Use**: Represents an active session on a table (open/close).
  - **Frontend / Backend**:
    - Must be created/updated/closed only via application logic (POS flow).
  - **Prisma Studio**:
    - Manual changes are not recommended; only for rare debugging/fixes.

- **`Order`, `OrderItem`**
  - **Use**: Core transactional data for POS (live orders, bill, tax, totals).
  - **Frontend + API**:
    - All creation/updates must happen through the POS UI (add items, change quantity, cancel items).
  - **Prisma Studio**:
    - Use only to **read** or debug.
    - Do not manually edit amounts, status, tax, etc. (high audit/compliance risk).

- **`Payment`**
  - **Use**: Payment records for orders (CASH, CARD, STRIPE, PAYPAL, etc.).
  - **Frontend/Backend**:
    - Payments must always be generated by the payment flow (POS payment screen / payment provider callbacks).
  - **Prisma Studio**:
    - Only for audit / debugging (e.g. verify which amount was paid). Manual edits are high risk.

- **`KDSItem` & `KDSScreen`**
  - **KDSScreen**: Configuration of Kitchen Display Screens per branch.
  - **KDSItem**: Status of each order item in the kitchen (`CREATED`, `COOKING`, `READY`, `DISPATCHED`).
  - **Frontend**:
    - KDSScreen configuration UI (set by branch admin).
    - KDS app UI should change `KDSItem` statuses via buttons like "Start cooking", "Ready", "Dispatch".
  - **Prisma Studio**:
    - Only for debugging; avoid changing statuses manually in production.

---

## 6. Customers, Segments & Email Campaigns (CRM)

- **`Customer`**
  - **Frontend**:
    - Create/update customers from POS / CRM screens (name, phone, email).
    - Loyalty points updated via application logic (based on orders, promotions, etc.).
  - **Prisma Studio**:
    - Bulk import (e.g. importing an old customer database).
    - Rare manual fixes.

- **`Segment`**
  - **Use**: Customer segmentation rules (stored as JSON).
  - **Recommended**:
    - If you want to give clients advanced marketing tools, build a **segmentation builder UI** in the frontend.
    - Otherwise, dev team can define segments in Prisma Studio initially, and the frontend just lets users select from those segments.

- **`EmailCampaign`**
  - **Frontend**:
    - Configure campaigns from a marketing UI (subject, content, scheduled time).
  - **Backend**:
    - A scheduler job processes and sends the campaigns.
  - **Prisma Studio**:
    - Only for debugging or quick manual test campaigns.

---

## 7. Cashbook, TSE & Audit Logs (Compliance / Tax)

- **`CashbookEntry`**
  - **Use**: Cash deposits, withdrawals, manual corrections – fiscal records.
  - **Frontend**:
    - If cashiers need to add cashbook entries, this must be done through a controlled UI with proper permissions.
  - **Prisma Studio**:
    - Because of **compliance risk**, avoid manual editing here. Only dev team should touch this for debugging.

- **`TSETransaction` & `TSEQueue`**
  - **Use**: Germany fiscalization (Fiskaly) records.
  - **Frontend**:
    - Never editable; you may only display status / logs.
  - **Backend**:
    - APIs manage these tables (signing orders, retries, queue processing).
  - **Prisma Studio**:
    - Only for audit/troubleshooting. Manual changes must be strictly controlled.

- **`AuditLog`**
  - **Use**: Tracks which staff member did which action (`entityType`, `entityId`, `action`).
  - **Frontend**:
    - Only read-only activity log screens.
  - **Prisma Studio**:
    - Only for investigation; do not manually insert/update for normal operations.

---

## 8. Summary – Quick Decision Guide

- **Backend / Dev Team Only (Prisma Studio / migrations)**
  - `SuperAdmin`
  - `FiskalyPlatformConfig`
  - `Permission`
  - `SubscriptionPlan` (platform-level)
  - Sensitive configs: `TenantFiskalyConfig`
  - Fiscal / compliance core: `TSETransaction`, `TSEQueue`, `AuditLog` (read-only for client)

- **Primarily Frontend (Managed via Client UI)**
  - Tenant settings: `Tenant` basic info (name, logo, status – within limits)
  - Branch structure: `Branch`
  - Users & roles (if flexible RBAC is desired): `Role`, `RolePermission`, `Staff`
  - Menu: `Category`, `Product`, `ProductVariant`, `AddonGroup`, `AddonItem`
  - Floor plan: `DiningTable`
  - Live operations (create/update only through the app): `Session`, `Order`, `OrderItem`, `Payment`, `KDSItem`, `KDSScreen`
  - CRM: `Customer`, `Segment`, `EmailCampaign`
  - Cash operations: `CashbookEntry` (via a controlled UI)

- **Prisma Studio Practical Use for Clients**
  - **Best practice**: Normally, do **not** give clients direct Prisma Studio access.
  - If you must give access:
    - Make it clear that they should only touch **safe master data** (e.g. `Category`, `Product`, `Branch`, `DiningTable`).
    - They must **never change transactional tables** like `Order`, `Payment`, `TSETransaction`, `CashbookEntry`.
    - Share this document during training so they know what is safe and what is risky.

