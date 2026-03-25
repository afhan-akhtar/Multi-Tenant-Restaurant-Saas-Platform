import { broadcastKdsStreamEvent } from "@/lib/realtime-hub";

export function broadcastTenantKdsEvent(tenantId, event, payload) {
  if (!tenantId || !event) return false;

  return broadcastKdsStreamEvent({
    tenantId,
    branchId: payload?.order?.branchId ?? null,
    event,
    payload,
  });
}
