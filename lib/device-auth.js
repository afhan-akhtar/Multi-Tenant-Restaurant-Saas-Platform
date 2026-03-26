import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";

export const DEVICE_TOKEN_HEADER = "x-device-token";
export const DEVICE_TENANT_HEADER = "x-tenant-id";
export const DEVICE_TYPE_HEADER = "x-device-type";

const SOCKET_TICKET_TTL_MS = 24 * 60 * 60 * 1000;

function parseInteger(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required for device auth.");
  }
  return secret;
}

export function hashDeviceToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

export function generateDeviceTokenValue() {
  return crypto.randomBytes(32).toString("base64url");
}

export function getDeviceRoutePath({ tenantId, deviceType, token }) {
  const normalizedType = String(deviceType || "").toUpperCase();
  const prefix = normalizedType === "POS" ? "pos" : "kds";
  const params = new URLSearchParams({ token: String(token || "") });
  return `/${prefix}/${tenantId}?${params.toString()}`;
}

export function getAbsoluteDeviceUrl(request, { tenantId, deviceType, token }) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}${getDeviceRoutePath({ tenantId, deviceType, token })}`;
}

export async function validateDeviceAccess({ tenantId, token, deviceType }) {
  const normalizedType = String(deviceType || "").toUpperCase();
  const normalizedToken = String(token || "").trim();
  const normalizedTenantId = parseInteger(tenantId);

  if (!normalizedTenantId || !normalizedToken || !["POS", "KDS"].includes(normalizedType)) {
    return null;
  }

  const device = await prisma.deviceToken.findFirst({
    where: {
      tenantId: normalizedTenantId,
      deviceType: normalizedType,
      status: "ACTIVE",
      tokenHash: hashDeviceToken(normalizedToken),
      tenant: { status: "ACTIVE" },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
          status: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      screen: {
        select: {
          id: true,
          name: true,
          stationType: true,
          isDefault: true,
        },
      },
    },
  });

  if (!device) {
    return null;
  }

  prisma.deviceToken
    .update({
      where: { id: device.id },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => {});

  return device;
}

async function resolveBranchId(tenantId, branchId) {
  if (branchId) return branchId;

  const fallbackBranch = await prisma.branch.findFirst({
    where: { tenantId },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  return fallbackBranch?.id ?? null;
}

async function resolveDeviceStaffId(tenantId, branchId) {
  const branchScopedStaff = await prisma.tenantAdmin.findFirst({
    where: {
      tenantId,
      status: "ACTIVE",
      ...(branchId ? { branchId } : {}),
    },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (branchScopedStaff?.id) {
    return branchScopedStaff.id;
  }

  const tenantStaff = await prisma.tenantAdmin.findFirst({
    where: {
      tenantId,
      status: "ACTIVE",
    },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  return tenantStaff?.id ?? null;
}

export async function getRequestActor(request, { allowedDeviceTypes = [] } = {}) {
  const sessionToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (sessionToken?.tenantId) {
    return {
      authMode: "staff",
      tenantId: sessionToken.tenantId ?? null,
      branchId: sessionToken.branchId ?? null,
      staffId: parseInteger(sessionToken.id),
      type: sessionToken.type ?? "staff",
      roleName: sessionToken.roleName ?? null,
    };
  }

  const deviceToken = request.headers.get(DEVICE_TOKEN_HEADER);
  const tenantId = parseInteger(request.headers.get(DEVICE_TENANT_HEADER));
  const requestedDeviceType = String(request.headers.get(DEVICE_TYPE_HEADER) || "").toUpperCase();

  if (!deviceToken || !tenantId || !requestedDeviceType) {
    return null;
  }

  if (allowedDeviceTypes.length > 0 && !allowedDeviceTypes.includes(requestedDeviceType)) {
    return null;
  }

  const device = await validateDeviceAccess({
    tenantId,
    token: deviceToken,
    deviceType: requestedDeviceType,
  });

  if (!device) {
    return null;
  }

  const branchId = await resolveBranchId(device.tenantId, device.branchId);
  const staffId = requestedDeviceType === "POS"
    ? await resolveDeviceStaffId(device.tenantId, branchId)
    : null;

  return {
    authMode: "device",
    deviceId: device.id,
    deviceName: device.name,
    deviceType: device.deviceType,
    tenantId: device.tenantId,
    branchId,
    screenId: device.screenId ?? null,
    staffId,
    tenant: device.tenant,
    branch: device.branch,
    screen: device.screen,
  };
}

export function createDeviceSocketTicket({ tenantId, branchId = null, screenId = null, deviceType }) {
  const payload = {
    tenantId: parseInteger(tenantId),
    branchId: parseInteger(branchId),
    screenId: parseInteger(screenId),
    deviceType: String(deviceType || "").toUpperCase(),
    iat: Date.now(),
    exp: Date.now() + SOCKET_TICKET_TTL_MS,
  };

  if (!payload.tenantId || !["POS", "KDS"].includes(payload.deviceType)) {
    throw new Error("Invalid device socket ticket payload.");
  }

  const payloadString = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadString).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payloadString)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyDeviceSocketTicket(ticket, expectedDeviceType = null) {
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
    if (!payload?.tenantId || !payload?.deviceType) {
      return null;
    }

    if (expectedDeviceType && payload.deviceType !== expectedDeviceType) {
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
