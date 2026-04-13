/**
 * Create PostgreSQL database restaurant_tenant_<id>, apply tenant schema, set Tenant.databaseUrl.
 *
 * Usage:
 *   node scripts/provision-tenant.mjs [platformTenantId]
 *
 * Requires .env with PLATFORM_DATABASE_URL or DATABASE_URL (same server as platform DB).
 * Optional: DATABASE_ADMIN_URL — connection to `postgres` DB for CREATE DATABASE (defaults derived).
 */
import "dotenv/config";
import { provisionTenantDatabaseAndMigrate } from "../lib/provision-tenant-database.js";

const raw = process.argv[2] ?? "1";
const id = Number.parseInt(raw, 10);
if (!Number.isFinite(id) || id < 1) {
  console.error("Usage: node scripts/provision-tenant.mjs [platformTenantId]   (default: 1)");
  process.exit(1);
}

console.log(`Provisioning tenant DB for platform Tenant id=${id}...`);
const url = await provisionTenantDatabaseAndMigrate(id);
console.log("OK. databaseUrl stored on platform Tenant row:");
console.log(url);
