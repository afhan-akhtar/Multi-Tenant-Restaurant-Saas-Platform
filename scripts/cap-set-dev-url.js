/**
 * Sets capacitor.config.json server.url so Android emulator + iOS Simulator both work.
 * - Android emulator: localhost = device itself → use LAN IP or 10.0.2.2
 * - iOS Simulator: 127.0.0.1 works for host
 * - Same Mac LAN IP works for BOTH when Next listens on 0.0.0.0 (see server.js)
 *
 * Tablet path defaults to /tablet/connect (paste device token or full URL — avoids bookmarking a LAN /tablet?token= URL).
 * Legacy: CAP_TABLET_PATH=/tablet?token=... to open straight into a device.
 *
 * Stable production URL (no LAN): set server.url to https://your-domain.com/tablet/connect (deploy Next first).
 *
 * Override: CAP_SERVER_HOST=127.0.0.1 npm run cap:sync   (iOS Simulator)
 * Override path: CAP_TABLET_PATH=/tablet?token=... npm run cap:sync
 * Default fallback when no LAN: 10.0.2.2 (Android emulator → host). Never use 127.0.0.1 for Android.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const os = require("os");

async function resolveDefaultTabletPath() {
  if (process.env.CAP_TABLET_PATH) {
    const p = process.env.CAP_TABLET_PATH.trim();
    return p.startsWith("/") ? p : `/${p}`;
  }
  return "/tablet/connect";
}

function getLanIpv4() {
  try {
    const nets = os.networkInterfaces();
    // Prefer typical Wi‑Fi / Ethernet interfaces so we don't pick Docker/vpn first.
    const preferred = ["en0", "en1", "en2", "wlan0", "eth0"];
    for (const name of preferred) {
      const group = nets[name];
      if (!group) continue;
      for (const net of group) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
    for (const group of Object.values(nets)) {
      for (const net of group || []) {
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
  console.log(
    "\n[cap] Physical phone: run `npm run dev` on this machine, same Wi‑Fi as the phone, then:\n" +
      "  npx cap sync android && npx cap open android\n" +
      "If you see ERR_CONNECTION_REFUSED: (1) dev server is running (2) phone browser opens http://" +
      host +
      ":" +
      port +
      " (3) macOS Firewall allows Node (4) IP changed — re-run this script.\n"
  );
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
