/**
 * One-off: set tenant@demo.com password in the demo tenant database.
 * Usage: node --env-file=.env.local scripts/set-demo-tenant-admin-password.mjs
 */
import { hashPassword } from "../lib/password.js";
import { platformPrisma } from "../lib/platform-db.js";
import { getTenantPrisma } from "../lib/tenant-db.js";

const email = "tenant@demo.com";
const newPassword = process.argv[2] || "password";

const hash = await hashPassword(newPassword);
const tenant = await platformPrisma.tenant.findFirst({
  where: { subdomain: "demo" },
  select: { id: true },
});
if (!tenant) {
  console.error("Tenant with subdomain 'demo' not found.");
  process.exit(1);
}

const tp = await getTenantPrisma(tenant.id);
const result = await tp.tenantAdmin.updateMany({
  where: { email },
  data: { passwordHash: hash },
});
console.log(`Updated ${result.count} row(s) for ${email} (password: "${newPassword}").`);
await platformPrisma.$disconnect();
await tp.$disconnect();
