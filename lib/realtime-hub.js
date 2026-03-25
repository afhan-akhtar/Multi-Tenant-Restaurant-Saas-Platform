function getSubscribers() {
  if (!globalThis.__KDS_SSE_SUBSCRIBERS__) {
    globalThis.__KDS_SSE_SUBSCRIBERS__ = new Map();
  }
  return globalThis.__KDS_SSE_SUBSCRIBERS__;
}

export function subscribeKdsStream({ tenantId, branchId = null, send }) {
  const subscribers = getSubscribers();
  const id = `${tenantId}:${branchId || "all"}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;

  subscribers.set(id, {
    tenantId,
    branchId,
    send,
  });

  return () => {
    subscribers.delete(id);
  };
}

export function broadcastKdsStreamEvent({ tenantId, branchId = null, event, payload }) {
  if (!tenantId || !event) return false;

  const subscribers = getSubscribers();
  for (const subscriber of subscribers.values()) {
    if (subscriber.tenantId !== tenantId) continue;
    if (subscriber.branchId && branchId && subscriber.branchId !== branchId) continue;

    try {
      subscriber.send({
        event,
        payload,
        sentAt: new Date().toISOString(),
      });
    } catch {
      // Ignore stale/disconnected subscribers; route cleanup removes them.
    }
  }

  return true;
}
