#!/usr/bin/env node
/**
 * Local dev: apply Prisma schema to platform DB + one tenant DB.
 * - Platform: uses DATABASE_URL / PLATFORM_DATABASE_URL (see prisma.config.ts).
 * - Tenant: uses TENANT_DATABASE_URL if set; otherwise derives
 *   `restaurant_tenant_1` from DATABASE_URL (same host/user, different database name).
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function run(cmd, env = process.env) {
  execSync(cmd, { cwd: root, stdio: "inherit", env, shell: true });
}

run(
  `npx prisma db push --schema=prisma/platform/schema.prisma`
);

let tenantUrl = process.env.TENANT_DATABASE_URL?.trim();
if (!tenantUrl && process.env.DATABASE_URL) {
  try {
    const u = new URL(process.env.DATABASE_URL);
    u.pathname = "/restaurant_tenant_1";
    tenantUrl = u.toString();
  } catch {
    console.warn("[db-sync] Could not derive tenant URL from DATABASE_URL; skip tenant push.");
  }
}

if (tenantUrl) {
  run(
    `npx prisma db push --schema=prisma/tenant/schema.prisma --config prisma/tenant/prisma.config.ts`,
    { ...process.env, TENANT_DATABASE_URL: tenantUrl }
  );
} else {
  console.warn("[db-sync] No tenant database URL; set TENANT_DATABASE_URL or DATABASE_URL.");
}
