/**
 * Sets capacitor.config.json server.url so Android emulator + iOS Simulator both work.
 * - Android emulator: localhost = device itself → use LAN IP or 10.0.2.2
 * - iOS Simulator: 127.0.0.1 works for host
 * - Same Mac LAN IP works for BOTH when Next listens on 0.0.0.0 (see server.js)
 *
 * Tablet path defaults to /tablet?token=demo-tablet-device-token (token identifies tenant; no id in path).
 *
 * Override: CAP_SERVER_HOST=127.0.0.1 npm run cap:sync   (iOS Simulator)
 * Override path: CAP_TABLET_PATH=/tablet/5?token=... npm run cap:sync
 * Play Store / production (same APK for all restaurants): point host at your domain and set
 *   CAP_TABLET_PATH=/tablet/connect
 * so the app opens the "paste tablet link" screen; staff paste the full URL from Admin → Devices.
 * Default fallback when no LAN: 10.0.2.2 (Android emulator → host). Never use 127.0.0.1 for Android.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const os = require("os");

const DEMO_TABLET_TOKEN = "demo-tablet-device-token";

async function resolveDefaultTabletPath() {
  if (process.env.CAP_TABLET_PATH) {
    return process.env.CAP_TABLET_PATH;
  }
  const { PrismaClient } = require("@prisma/client");
  const { PrismaPg } = require("@prisma/adapter-pg");
  if (!process.env.DATABASE_URL) {
    console.warn(
      `[cap] DATABASE_URL unset; using /tablet?token=${DEMO_TABLET_TOKEN} (may not match your DB).`
    );
    return `/tablet?token=${DEMO_TABLET_TOKEN}`;
  }
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { subdomain: "demo" },
      select: { id: true },
    });
    if (!tenant) {
      console.warn(
        `[cap] No tenant with subdomain "demo"; using /tablet?token=${DEMO_TABLET_TOKEN}. Run npm run db:seed.`
      );
      return `/tablet?token=${DEMO_TABLET_TOKEN}`;
    }
    const tabletPath = `/tablet?token=${DEMO_TABLET_TOKEN}`;
    console.log("[cap] Tablet path (demo token, tenant id in DB:", tenant.id, "):", tabletPath);
    return tabletPath;
  } catch (err) {
    console.warn("[cap] Could not resolve demo tenant from DB:", err.message);
    return `/tablet?token=${DEMO_TABLET_TOKEN}`;
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

function getLanIpv4() {
  try {
    for (const nets of Object.values(os.networkInterfaces())) {
      for (const net of nets || []) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  } catch {
    /* sandbox / restricted environments */
  }
  return null;
}

const root = path.join(__dirname, "..");
const configPath = path.join(root, "capacitor.config.json");

async function main() {
  const host =
    process.env.CAP_SERVER_HOST ||
    getLanIpv4() ||
    "10.0.2.2";
  const port = process.env.CAP_SERVER_PORT || "3000";
  const tabletPath = await resolveDefaultTabletPath();

  const url = `http://${host}:${port}${tabletPath.startsWith("/") ? tabletPath : `/${tabletPath}`}`;

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.server = config.server || {};
  config.server.url = url;
  config.server.cleartext = true;
  if (!config.server.androidScheme) {
    config.server.androidScheme = "https";
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  console.log("[cap] server.url =", url);
  if (host === "10.0.2.2") {
    console.warn(
      "[cap] Using Android emulator host alias 10.0.2.2. For iOS Simulator use: CAP_SERVER_HOST=127.0.0.1 npm run cap:sync — or connect Wi‑Fi so your LAN IP is detected for both."
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
