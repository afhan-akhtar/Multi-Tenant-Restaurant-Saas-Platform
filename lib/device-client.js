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
