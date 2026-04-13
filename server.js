const http = require("http");
const os = require("os");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = Number.parseInt(process.env.PORT || "3000", 10);

/**
 * Address the HTTP server binds to. MUST be 0.0.0.0 (all interfaces) for phones on Wi‑Fi.
 * If you set HOST=localhost in .env (common in tutorials), the old server listened only on
 * loopback → ERR_CONNECTION_REFUSED from another device. Use LISTEN_HOST for this instead.
 */
const listenHost = process.env.LISTEN_HOST || "0.0.0.0";

/** Passed to Next.js dev (asset/HMR URLs); keep localhost unless you know you need otherwise. */
const nextHostname = process.env.NEXT_DEV_HOSTNAME || "localhost";

const app = next({ dev, hostname: nextHostname, port });
const handle = app.getRequestHandler();

function logLanHint() {
  if (listenHost !== "0.0.0.0" && listenHost !== "::") return;
  const nets = os.networkInterfaces();
  const ips = [];
  for (const group of Object.values(nets)) {
    for (const net of group || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  if (ips.length) {
    console.log(
      "> On your phone (same Wi‑Fi), try:",
      ips.map((ip) => `http://${ip}:${port}`).join(" or ")
    );
  }
}

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));

  server.listen(port, listenHost, () => {
    console.log(`> Ready on http://${listenHost}:${port}`);
    logLanHint();
    if (process.env.HOST && ["127.0.0.1", "localhost", "::1"].includes(process.env.HOST)) {
      console.warn(
        "> Tip: HOST=localhost in .env only binds loopback. For mobile LAN testing, remove HOST or set LISTEN_HOST=0.0.0.0 (default)."
      );
    }
  });
});
