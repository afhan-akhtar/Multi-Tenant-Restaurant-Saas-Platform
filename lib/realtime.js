function getRealtimeBroadcaster() {
  return globalThis.__DEVICE_WSS_BROADCAST__;
}

export function getTenantKdsChannel(tenantId) {
  return `tenant:${tenantId}:kds`;
}

export function broadcastTenantKdsEvent(tenantId, event, payload) {
  const broadcaster = getRealtimeBroadcaster();
  if (typeof broadcaster !== "function" || !tenantId || !event) {
    return false;
  }

  broadcaster(getTenantKdsChannel(tenantId), {
    event,
    payload,
  });

  return true;
}
