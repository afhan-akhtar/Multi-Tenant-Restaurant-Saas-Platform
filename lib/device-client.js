export function getDeviceHeaders(deviceAuth) {
  if (!deviceAuth?.tenantId || !deviceAuth?.token || !deviceAuth?.deviceType) {
    return {};
  }

  return {
    "x-tenant-id": String(deviceAuth.tenantId),
    "x-device-token": String(deviceAuth.token),
    "x-device-type": String(deviceAuth.deviceType).toUpperCase(),
  };
}

/** Header name must match `lib/tablet-waiter.js` (TABLET_WAITER_SESSION_HEADER). */
export const TABLET_WAITER_SESSION_HEADER = "x-tablet-waiter-session";

export function getTabletWaiterHeaders(waiterSessionToken) {
  if (!waiterSessionToken) {
    return {};
  }
  return {
    [TABLET_WAITER_SESSION_HEADER]: String(waiterSessionToken),
  };
}
