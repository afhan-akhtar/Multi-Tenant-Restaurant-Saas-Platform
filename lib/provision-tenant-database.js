import { execSync } from "child_process";
import fs from "fs";
import pg from "pg";
import path from "path";

/**
 * Build a stable database name for a tenant (alphanumeric + underscore only).
 */
export function tenantDatabaseName(tenantId) {
  return `restaurant_tenant_${Number(tenantId)}`;
}

/**
 * Replace the database segment in a PostgreSQL connection URL.
 */
export function withDatabaseName(connectionString, databaseName) {
  try {
    const u = new URL(connectionString);
    u.pathname = "/" + databaseName;
    return u.toString();
  } catch {
    return connectionString.replace(/\/[^/?]*(?=[?#]|$)/, "/" + databaseName);
  }
}

/**
 * CREATE DATABASE using an admin connection (must not be connected to the target DB).
 */
export async function createPostgresDatabase(adminConnectionString, databaseName) {
  const safeName = databaseName.replace(/[^a-zA-Z0-9_]/g, "_");
  const client = new pg.Client({ connectionString: adminConnectionString });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE "${safeName.replace(/"/g, '""')}"`);
  } catch (err) {
    if (String(err?.message || "").includes("already exists")) {
      return safeName;
    }
    throw err;
  } finally {
    await client.end();
  }
  return safeName;
}

/**
 * Apply tenant schema: `migrate deploy` when `prisma/tenant/migrations` exists, otherwise
 * `db push` (repo ships without tenant migrations — local dev).
 */
export function migrateTenantSchema(tenantDatabaseUrl) {
  const root = process.cwd();
  const schema = path.join(root, "prisma/tenant/schema.prisma");
  const config = path.join(root, "prisma/tenant/prisma.config.ts");
  const migrationsDir = path.join(root, "prisma/tenant/migrations");
  const env = { ...process.env, TENANT_DATABASE_URL: tenantDatabaseUrl };
  const hasMigrations =
    fs.existsSync(migrationsDir) &&
    fs.readdirSync(migrationsDir).some((n) => n !== ".gitkeep" && !n.startsWith("."));

  if (hasMigrations) {
    execSync(`npx prisma migrate deploy --schema="${schema}" --config="${config}"`, {
      env,
      stdio: "inherit",
      shell: true,
    });
  } else {
    console.warn(
      "[tenant schema] No prisma/tenant/migrations — using db push. Add migrations for production deploys."
    );
    execSync(
      `npx prisma db push --schema="${schema}" --config="${config}" --accept-data-loss`,
      {
        env,
        stdio: "inherit",
        shell: true,
      }
    );
  }
}

/**
 * Connection URL to the default `postgres` database (for CREATE DATABASE).
 */
export function postgresMaintenanceUrl() {
  const explicit = process.env.DATABASE_ADMIN_URL?.trim();
  if (explicit) return explicit;
  const base =
    process.env.PLATFORM_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (!base) {
    throw new Error(
      "Set DATABASE_ADMIN_URL or PLATFORM_DATABASE_URL for database provisioning."
    );
  }
  return withDatabaseName(base, "postgres");
}

/**
 * Create the tenant database, apply tenant migrations, and store `databaseUrl` on the platform Tenant row.
 */
export async function provisionTenantDatabaseAndMigrate(platformTenantId) {
  const { platformPrisma } = await import("./platform-db.js");
  const dbName = tenantDatabaseName(platformTenantId);
  await createPostgresDatabase(postgresMaintenanceUrl(), dbName);
  const base =
    process.env.PLATFORM_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim();
  const tenantUrl = withDatabaseName(base, dbName);
  migrateTenantSchema(tenantUrl);
  await platformPrisma.tenant.update({
    where: { id: platformTenantId },
    data: { databaseUrl: tenantUrl },
  });
  return tenantUrl;
}
