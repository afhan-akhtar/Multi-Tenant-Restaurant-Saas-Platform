/**
 * One-off helper: replace legacy `import { prisma } from "@/lib/db"` patterns.
 * Run: node scripts/patch-db-imports.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (p.endsWith(".js")) out.push(p);
  }
  return out;
}

const files = walk(path.join(root, "app")).concat(walk(path.join(root, "lib")));

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes('from "@/lib/db"') && !s.includes("from '@/lib/db'")) continue;

  // Skip already migrated db.js
  if (file.endsWith("lib/db.js")) continue;

  const orig = s;

  // platform-only: super-admin, admin plans, cron subscriptions
  const platformHint =
    file.includes("/super-admin/") ||
    file.includes("/api/admin/plans") ||
    file.includes("/api/cron/subscriptions") ||
    file.includes("/api/admin/subscriptions/") && !file.includes("subscription-requests") ||
    file === path.join(root, "app/admin/subscriptions/page.js") ||
    file === path.join(root, "app/admin/settings/page.js") ||
    file === path.join(root, "app/admin/commission/page.js") ||
    file === path.join(root, "app/admin/layout.js") ||
    file === path.join(root, "app/(main)/subscriptions/page.js") ||
    file === path.join(root, "app/(main)/commission/page.js") ||
    file.includes("/api/subscription/payments/") ||
    file.includes("/api/subscription/requests") ||
    file.includes("/api/admin/subscription-requests") ||
    file.includes("/invoice/") ||
    file.includes("app/invoice/");

  if (platformHint) {
    s = s.replace(
      /import \{ prisma \} from ["']@\/lib\/db["'];?/,
      `import { platformPrisma } from "@/lib/platform-db";`
    );
    s = s.replace(/\bprisma\./g, "platformPrisma.");
  } else {
    // Tenant: inject getTenantPrisma — only safe for files that already use tenantId
    if (
      s.includes("session.user?.tenantId") ||
      s.includes("session.user.tenantId") ||
      s.includes("params.tenantId") ||
      s.includes("getRequestActor")
    ) {
      s = s.replace(
        /import \{ prisma \} from ["']@\/lib\/db["'];?/,
        `import { getTenantPrisma } from "@/lib/tenant-db";`
      );
      // After tenantId guard, add const prisma = await getTenantPrisma(tenantId)
      if (s.includes("getTenantPrisma") && !s.includes("await getTenantPrisma(tenantId)")) {
        s = s.replace(
          /(const tenantId =[^\n]+\n(?:  if \(!tenantId\)[^\n]+\n))(\n  [^\n])/,
          (m, a, b) => {
            if (s.includes("const prisma = await getTenantPrisma")) return m;
            return `${a}  const prisma = await getTenantPrisma(tenantId);\n${b}`;
          }
        );
        // simpler: if file has "if (!tenantId)" return block
        const m2 = s.match(
          /(if \(!tenantId\) return[^\n]+\n\n)(  const \w+ = await prisma\.)/
        );
        if (m2) {
          s = s.replace(
            m2[0],
            `${m2[1]}  const prisma = await getTenantPrisma(tenantId);\n\n${m2[2].replace(/^  const \w+ = await prisma\./, "  const data = await prisma.")}`
          );
          // too fragile — abort script approach for bulk
        }
      }
    }
  }

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log("patched", path.relative(root, file));
  }
}
