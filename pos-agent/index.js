#!/usr/bin/env node
/**
 * Local POS Agent — receives print / drawer jobs from the Next.js API or browser bridge.
 * Configure printer in tenant DB (posHardwareSettings) or pass printer in each job body.
 *
 * Usage: node pos-agent/index.js
 * Env: PORT (default 3910), AGENT_SECRET (optional), QUEUE_PATH, ALLOW_LOCALHOST_NO_SECRET=1
 */

const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const net = require("net");

const PORT = Number(process.env.PORT) || 3910;
const AGENT_SECRET = String(process.env.AGENT_SECRET || "").trim();
const ALLOW_LOCALHOST_NO_SECRET = String(process.env.ALLOW_LOCALHOST_NO_SECRET || "1") === "1";
const QUEUE_PATH =
  process.env.QUEUE_PATH || path.join(process.env.HOME || ".", ".pos-agent-failed.jsonl");

function isLocalAddress(addr) {
  return addr === "127.0.0.1" || addr === "::1" || addr === "::ffff:127.0.0.1";
}

function unauthorized(req) {
  if (!AGENT_SECRET) return false;
  const got = String(req.headers["x-pos-agent-secret"] || "").trim();
  if (got === AGENT_SECRET) return false;
  if (ALLOW_LOCALHOST_NO_SECRET && isLocalAddress(req.socket?.remoteAddress || "")) {
    return false;
  }
  return true;
}

async function appendQueueLine(entry) {
  const line = `${JSON.stringify({ ...entry, at: new Date().toISOString() })}\n`;
  await fs.mkdir(path.dirname(QUEUE_PATH), { recursive: true });
  await fs.appendFile(QUEUE_PATH, line, "utf8");
}

async function sendNetwork(host, port, buf) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => {
      socket.write(buf, (err) => {
        if (err) {
          reject(err);
          return;
        }
        socket.end();
      });
    });
    socket.on("error", reject);
    socket.on("close", resolve);
  });
}

async function sendUsbRaw(devicePath, buf) {
  const fh = await fs.open(devicePath, "w");
  try {
    await fh.write(buf);
  } finally {
    await fh.close();
  }
}

async function sendToPrinter(printer, buf) {
  const type = String(printer?.type || "network").toLowerCase();
  if (type === "usb_raw") {
    const p = String(printer.devicePath || "").trim();
    if (!p) throw new Error("usb_raw printer requires devicePath");
    await sendUsbRaw(p, buf);
    return;
  }
  const host = String(printer?.host || "").trim();
  const port = Math.min(65535, Math.max(1, Number(printer?.port) || 9100));
  if (!host) throw new Error("network printer requires host");
  await sendNetwork(host, port, buf);
}

async function handleJob(req, res, jobName) {
  if (unauthorized(req)) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  const chunks = [];
  for await (const ch of req) chunks.push(ch);
  let body = {};
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  const b64 = String(body.payload_base64 || "").trim();
  if (!b64) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "payload_base64 required" }));
    return;
  }

  let buf;
  try {
    buf = Buffer.from(b64, "base64");
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid base64" }));
    return;
  }

  const printer = body.printer && typeof body.printer === "object" ? body.printer : {};

  try {
    await sendToPrinter(printer, buf);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, job: jobName }));
  } catch (e) {
    await appendQueueLine({
      job: jobName,
      error: e?.message || String(e),
      tenant_id: body.tenant_id,
      printer,
    }).catch(() => {});
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: e?.message || "Printer I/O failed" }));
  }
}

const server = http.createServer((req, res) => {
  const u = req.url || "/";
  if (req.method === "GET" && (u === "/health" || u === "/")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "pos-agent", port: PORT }));
    return;
  }
  if (req.method === "POST" && u === "/print") {
    return handleJob(req, res, "print");
  }
  if (req.method === "POST" && u === "/drawer") {
    return handleJob(req, res, "drawer");
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[pos-agent] listening on http://127.0.0.1:${PORT} (bound 0.0.0.0)`);
});
