import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export const TABLET_WAITER_SESSION_HEADER = "x-tablet-waiter-session";

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required for tablet waiter sessions.");
  }
  return secret;
}

/**
 * Signed bearer token for waiter-only tablet actions (checkout, merge, modify orders).
 * Payload: { tenantId, staffId, exp }
 */
export function signTabletWaiterSession({ tenantId, staffId }) {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const payload = JSON.stringify({
    tenantId: Number(tenantId),
    staffId: Number(staffId),
    exp,
  });
  const signature = crypto.createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyTabletWaiterSession(token) {
  try {
    const [payloadB64, signature] = String(token || "").split(".");
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
    if (!payload?.tenantId || !payload?.staffId || !payload?.exp) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return {
      tenantId: payload.tenantId,
      staffId: payload.staffId,
    };
  } catch {
    return null;
  }
}

export async function getTabletWaiterFromRequest(request) {
  const token = request.headers.get(TABLET_WAITER_SESSION_HEADER);
  return verifyTabletWaiterSession(token);
}

function roleIsWaiter(roleName) {
  return String(roleName || "")
    .toLowerCase()
    .includes("waiter");
}

/**
 * Returns active staff in branch whose role is considered waiter (role name contains "waiter").
 */
export async function findWaiterStaffForBranch(tenantId, branchId) {
  const staffList = await prisma.tenantAdmin.findMany({
    where: {
      tenantId,
      branchId,
      status: "ACTIVE",
    },
    include: {
      role: { select: { name: true } },
    },
    orderBy: { id: "asc" },
  });

  return staffList.filter((s) => roleIsWaiter(s.role?.name));
}

export async function assertWaiterStaff(tenantId, branchId, staffId) {
  const staff = await prisma.tenantAdmin.findFirst({
    where: {
      id: staffId,
      tenantId,
      branchId,
      status: "ACTIVE",
    },
    include: {
      role: { select: { name: true } },
    },
  });

  if (!staff || !roleIsWaiter(staff.role?.name)) {
    return null;
  }

  return staff;
}

export async function verifyTenantTabletPin(tenantId, pin) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { tabletSettings: true },
  });

  const settings = tenant?.tabletSettings && typeof tenant.tabletSettings === "object" ? tenant.tabletSettings : {};
  const hash = settings.waiterPinHash;

  if (!hash || typeof hash !== "string") {
    return { ok: false, error: "Tablet waiter PIN is not configured for this restaurant." };
  }

  const match = await bcrypt.compare(String(pin || ""), hash);
  if (!match) {
    return { ok: false, error: "Invalid PIN" };
  }

  return { ok: true };
}
