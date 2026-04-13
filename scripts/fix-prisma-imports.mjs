import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "generated") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (p.endsWith(".js")) out.push(p);
  }
  return out;
}

const files = walk(path.join(root, "app")).concat(walk(path.join(root, "lib")));

const platformPaths = new Set([
  "app/admin/subscriptions/page.js",
  "app/admin/settings/page.js",
  "app/admin/commission/page.js",
  "app/admin/layout.js",
  "app/api/admin/plans/route.js",
  "app/api/admin/plans/[id]/route.js",
  "app/api/admin/plans/seed/route.js",
  "app/api/admin/subscriptions/route.js",
  "app/api/admin/subscriptions/billing/route.js",
  "app/api/admin/subscription-requests/[id]/route.js",
  "app/api/cron/subscriptions/route.js",
  "app/api/subscription/payments/stripe/complete/route.js",
  "app/api/subscription/payments/stripe/create-intent/route.js",
  "app/api/subscription/requests/route.js",
  "app/(main)/subscriptions/page.js",
  "app/invoice/[id]/page.js",
]);

for (const file of files) {
  const rel = path.relative(root, file);
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes('import { prisma } from "@/lib/db"')) continue;

  if (platformPaths.has(rel) || rel.includes("super-admin") || rel.startsWith(`app${path.sep}api${path.sep}super-admin`)) {
    s = s.replace(
      'import { prisma } from "@/lib/db";',
      'import { platformPrisma } from "@/lib/platform-db";'
    );
    s = s.replace(/\bprisma\./g, "platformPrisma.");
    fs.writeFileSync(file, s);
    console.log("platform:", rel);
    continue;
  }

  if (s.includes("const tenantId = session.user?.tenantId")) {
    s = s.replace(
      'import { prisma } from "@/lib/db";',
      'import { getTenantPrisma } from "@/lib/tenant-db";'
    );
    if (!s.includes("await getTenantPrisma(tenantId)")) {
      s = s.replace(
        /(if \(!tenantId\) return[^\n]+\n)/,
        "$1\n  const prisma = await getTenantPrisma(tenantId);\n"
      );
    }
    fs.writeFileSync(file, s);
    console.log("tenant+session:", rel);
  }
}
