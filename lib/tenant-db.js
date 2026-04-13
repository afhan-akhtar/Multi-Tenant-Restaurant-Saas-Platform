import { PrismaClient } from "../generated/prisma-tenant/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { platformPrisma } from "./platform-db.js";
import { tenantDatabaseName, withDatabaseName } from "./provision-tenant-database.js";

/** @type {Map<string, import("../generated/prisma-tenant/index.js").PrismaClient>} */
const tenantClientByUrl = new Map();

/** Avoid repeating mirror upserts on every request (platform remains source of truth). */
const ensuredTenantMirrorIds = new Set();

/**
 * Ensures the single `Tenant` row exists in this tenant database (FK parent for Customer, Branch, etc.).
 * Empty DBs provisioned without seed often lack this row.
 */
async function ensureTenantMirrorRow(tenantId, tenantPrisma) {
  if (ensuredTenantMirrorIds.has(tenantId)) return;

  const pt = await platformPrisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      subdomain: true,
      country: true,
      logoUrl: true,
      status: true,
      createdAt: true,
    },
  });
  if (!pt) {
    throw new Error(`Platform tenant ${tenantId} not found.`);
  }

  await tenantPrisma.tenant.upsert({
    where: { id: tenantId },
    create: {
      id: pt.id,
      name: pt.name,
      subdomain: pt.subdomain,
      country: pt.country || "",
      logoUrl: pt.logoUrl,
      status: pt.status,
      createdAt: pt.createdAt,
    },
    update: {
      name: pt.name,
      subdomain: pt.subdomain,
      country: pt.country || "",
      logoUrl: pt.logoUrl,
      status: pt.status,
    },
  });

  ensuredTenantMirrorIds.add(tenantId);
}

export function createTenantPrismaClient(connectionString) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function deriveTenantDatabaseUrlFromEnv(tenantId) {
  const base =
    process.env.PLATFORM_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (!base) return null;
  return withDatabaseName(base, tenantDatabaseName(tenantId));
}

/**
 * Resolves the tenant Postgres URL from the platform registry, or derives it from
 * PLATFORM_DATABASE_URL / DATABASE_URL (same rules as provisionTenantDatabaseAndMigrate)
 * when `databaseUrl` was never stored — e.g. legacy seeds.
 */
export async function getTenantDatabaseUrl(tenantId) {
  const row = await platformPrisma.tenant.findUnique({
    where: { id: tenantId },
    select: { databaseUrl: true },
  });
  let url = row?.databaseUrl?.trim();
  if (!url) {
    url = deriveTenantDatabaseUrlFromEnv(tenantId);
    if (url) {
      try {
        await platformPrisma.tenant.update({
          where: { id: tenantId },
          data: { databaseUrl: url },
        });
      } catch {
        // Row may be missing or concurrent update; still try connecting with derived URL.
      }
    }
  }
  if (!url) {
    throw new Error(
      `Tenant ${tenantId} has no tenant database URL. Set Tenant.databaseUrl in the platform DB, or set PLATFORM_DATABASE_URL (or DATABASE_URL) so the URL can be derived, and ensure the tenant database exists (run provisioning or migrate).`
    );
  }
  return url;
}

/**
 * Prisma client for the given tenant’s dedicated database (cached per URL).
 */
export async function getTenantPrisma(tenantId) {
  const url = await getTenantDatabaseUrl(tenantId);
  let client = tenantClientByUrl.get(url);
  if (!client) {
    client = createTenantPrismaClient(url);
    tenantClientByUrl.set(url, client);
  }
  await ensureTenantMirrorRow(tenantId, client);
  return client;
}

export async function getTenantPrismaBySubdomain(subdomain) {
  const key = String(subdomain || "")
    .trim()
    .toLowerCase();
  if (!key) return null;
  const t = await platformPrisma.tenant.findUnique({
    where: { subdomain: key },
    select: { id: true },
  });
  if (!t) return null;
  return getTenantPrisma(t.id);
}
