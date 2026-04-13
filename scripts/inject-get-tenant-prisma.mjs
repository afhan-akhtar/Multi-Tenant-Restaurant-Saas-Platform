import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const files = `
lib/kds-routing.js
lib/refunds/service.js
lib/dine-in-order.js
app/api/tables/route.js
app/api/kds/screens/route.js
app/api/auth/debug/route.js
app/api/loyalty/settings/route.js
app/api/tse/dsfinvk-export/route.js
app/api/tablet/tables/transfer-waiter/route.js
app/tablet/page.js
app/api/cashbook/withdrawal/route.js
app/api/devices/tablet-waiter-pin/route.js
app/api/cron/tse-migrate/route.js
app/api/customers/route.js
app/api/tse/dsfinvk/route.js
app/api/refunds/partial/route.js
app/tablet/[tenantId]/page.js
app/api/tablet/order/serve/route.js
app/api/addons/route.js
app/api/kds/screens/[id]/route.js
app/api/tablet/orders/route.js
app/api/categories/route.js
app/api/products/route.js
app/api/customers/[id]/route.js
app/api/tablet/reports/summary/route.js
app/api/tablet/tables/merge/route.js
app/api/settings/route.js
app/api/tablet/tables/route.js
app/api/tse/dsfinvk-sync/route.js
app/receipt/[id]/storno/page.js
app/api/tablet/fcm/register/route.js
app/api/tablet/order/append/route.js
app/api/cashbook/deposit/route.js
`
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .map((f) => path.join(root, f));

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.warn("missing", file);
    continue;
  }
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes('import { prisma } from "@/lib/db"')) continue;

  s = s.replace(
    'import { prisma } from "@/lib/db";',
    'import { getTenantPrisma } from "@/lib/tenant-db";'
  );

  // Inject after common tenantId guard (JWT / actor)
  const patterns = [
    /if \(!tenantId\) return NextResponse\.json\(\{ error: "Restaurant context required" \}, \{ status: 400 \}\);\r?\n\r?\n/g,
    /if \(!tenantId\) return NextResponse\.json\(\{ error: "Unauthorized" \}, \{ status: 401 \}\);\r?\n\r?\n/g,
  ];
  for (const re of patterns) {
    s = s.replace(re, (m) => {
      return `${m}    const prisma = await getTenantPrisma(tenantId);\n\n`;
    });
  }

  // Single-line tenantId check
  s = s.replace(
    /if \(!tenantId\) return NextResponse\.json\(\{ error: "Restaurant context required" \}, \{ status: 400 \}\);\r?\n(?!\s*const prisma)/g,
    `if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });\n    const prisma = await getTenantPrisma(tenantId);\n`
  );

  fs.writeFileSync(file, s);
  console.log("ok", path.relative(root, file));
}
