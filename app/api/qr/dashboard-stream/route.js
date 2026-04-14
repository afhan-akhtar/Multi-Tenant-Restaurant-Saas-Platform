import { auth } from "@/lib/auth";
import { subscribeKdsStream } from "@/lib/realtime-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toSsePayload(message) {
  return `data: ${JSON.stringify(message)}\n\n`;
}

/**
 * SSE for restaurant staff: same KDS event bus as kitchen devices, so QR orders show up instantly on the dashboard.
 */
export async function GET(request) {
  const session = await auth();
  const tenantId = session?.user?.tenantId ?? null;
  const branchId = session?.user?.branchId ?? null;

  if (!tenantId || session?.user?.type !== "staff") {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  let cleanedUp = false;
  let unsubscribe = () => {};
  let heartbeat = null;
  let abortHandler = null;

  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
    unsubscribe();
    unsubscribe = () => {};
    if (abortHandler) {
      request.signal.removeEventListener("abort", abortHandler);
      abortHandler = null;
    }
  };

  const stream = new ReadableStream({
    start(controller) {
      const send = (message) => {
        controller.enqueue(encoder.encode(toSsePayload(message)));
      };

      send({
        event: "connected",
        payload: { tenantId, branchId },
        sentAt: new Date().toISOString(),
      });

      unsubscribe = subscribeKdsStream({
        tenantId,
        branchId: branchId ?? null,
        send,
      });

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 15000);

      abortHandler = () => {
        cleanup();
        try {
          controller.close();
        } catch {}
      };

      request.signal.addEventListener("abort", abortHandler);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
