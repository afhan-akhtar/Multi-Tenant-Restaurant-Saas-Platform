const http = require("http");
const crypto = require("crypto");
const next = require("next");
const { WebSocketServer, WebSocket } = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required to run the device WebSocket server.");
  }
  return secret;
}

function verifySocketTicket(ticket) {
  try {
    const [payloadB64, signature] = String(ticket || "").split(".");
    if (!payloadB64 || !signature) return null;

    const payloadString = Buffer.from(payloadB64, "base64url").toString("utf8");
    const expectedSignature = crypto
      .createHmac("sha256", getSigningSecret())
      .update(payloadString)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(payloadString);
    if (!payload?.tenantId || payload?.deviceType !== "KDS") {
      return null;
    }

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getTenantKdsChannel(tenantId) {
  return `tenant:${tenantId}:kds`;
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  const wss = new WebSocketServer({ noServer: true });

  global.__DEVICE_WSS_BROADCAST__ = (channel, message) => {
    const data = JSON.stringify({
      channel,
      ...message,
      sentAt: new Date().toISOString(),
    });

    for (const client of wss.clients) {
      if (client.readyState !== WebSocket.OPEN) continue;
      if (client.channel !== channel) continue;
      client.send(data);
    }
  };

  wss.on("connection", (socket, request, payload) => {
    socket.channel = getTenantKdsChannel(payload.tenantId);
    socket.isAlive = true;

    socket.on("pong", () => {
      socket.isAlive = true;
    });

    socket.send(
      JSON.stringify({
        event: "connected",
        payload: {
          tenantId: payload.tenantId,
          deviceType: payload.deviceType,
        },
        sentAt: new Date().toISOString(),
      })
    );
  });

  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (socket.isAlive === false) {
        socket.terminate();
        continue;
      }

      socket.isAlive = false;
      socket.ping();
    }
  }, 30000);

  server.on("upgrade", (request, socket, head) => {
    try {
      const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
      if (url.pathname !== "/ws") {
        socket.destroy();
        return;
      }

      const payload = verifySocketTicket(url.searchParams.get("ticket"));
      if (!payload) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request, payload);
      });
    } catch (error) {
      console.error("[ws upgrade error]", error);
      socket.destroy();
    }
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  server.on("close", () => {
    clearInterval(heartbeat);
  });
});
