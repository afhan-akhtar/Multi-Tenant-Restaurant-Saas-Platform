import { getRequestActor, verifyDeviceSocketTicket } from "@/lib/device-auth";
import { subscribeKdsStream } from "@/lib/realtime-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toSsePayload(message) {
  return `data: ${JSON.stringify(message)}\n\n`;
}

async function resolveStreamActor(request) {
  const actor = await getRequestActor(request, { allowedDeviceTypes: ["KDS"] });
  if (actor?.tenantId) {
    return actor;
  }

  const { searchParams } = new URL(request.url);
  const ticket = searchParams.get("ticket");
  const payload = verifyDeviceSocketTicket(ticket, "KDS");
  if (!payload?.tenantId) {
    return null;
  }

  return {
    authMode: "stream",
    tenantId: payload.tenantId,
    branchId: payload.branchId ?? null,
    screenId: payload.screenId ?? null,
    deviceType: payload.deviceType,
  };
}

export async function GET(request) {
  const actor = await resolveStreamActor(request);
  if (!actor?.tenantId) {
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
        payload: {
          tenantId: actor.tenantId,
          branchId: actor.branchId,
          screenId: actor.screenId ?? null,
          deviceType: actor.deviceType || "KDS",
        },
        sentAt: new Date().toISOString(),
      });

      unsubscribe = subscribeKdsStream({
        tenantId: actor.tenantId,
        branchId: actor.branchId ?? null,
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
