import { prisma } from "@/lib/db";
import { getRequestActor } from "@/lib/device-auth";

function toIso(value) {
  return value ? new Date(value).toISOString() : null;
}

export async function requireTenantStaffActor(request) {
  const actor = await getRequestActor(request);
  if (!actor?.tenantId || actor.authMode !== "staff") {
    return null;
  }
  return actor;
}

export function serializeKdsScreen(screen) {
  if (!screen) return null;
  return {
    id: screen.id,
    branchId: screen.branchId,
    name: screen.name,
    code: screen.code || "",
    stationType: screen.stationType,
    isActive: Boolean(screen.isActive),
    isDefault: Boolean(screen.isDefault),
    branch: screen.branch
      ? {
          id: screen.branch.id,
          name: screen.branch.name,
        }
      : null,
    _count: screen._count || undefined,
  };
}

export function serializeDeviceToken(device) {
  if (!device) return null;
  return {
    id: device.id,
    tenantId: device.tenantId,
    branchId: device.branchId,
    screenId: device.screenId ?? null,
    name: device.name,
    deviceType: device.deviceType,
    status: device.status,
    lastSeenAt: toIso(device.lastSeenAt),
    createdAt: toIso(device.createdAt),
    updatedAt: toIso(device.updatedAt),
    branch: device.branch
      ? {
          id: device.branch.id,
          name: device.branch.name,
        }
      : null,
    screen: device.screen
      ? {
          id: device.screen.id,
          name: device.screen.name,
          stationType: device.screen.stationType,
        }
      : null,
  };
}

export async function getTenantBranches(tenantId) {
  return prisma.branch.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function getTenantKdsScreens(tenantId) {
  return prisma.kDSScreen.findMany({
    where: { branch: { tenantId } },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          deviceTokens: true,
          kdsItems: true,
        },
      },
    },
    orderBy: [{ branchId: "asc" }, { name: "asc" }],
  });
}

export async function getTenantDeviceTokens(tenantId) {
  return prisma.deviceToken.findMany({
    where: { tenantId },
    include: {
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
        },
      },
    },
    orderBy: [{ deviceType: "asc" }, { name: "asc" }],
  });
}

export async function ensureTenantBranch(tenantId, branchId) {
  if (!branchId) return null;
  return prisma.branch.findFirst({
    where: {
      id: Number(branchId),
      tenantId,
    },
  });
}

export async function getDefaultTenantBranch(tenantId) {
  return prisma.branch.findFirst({
    where: { tenantId },
    orderBy: { id: "asc" },
  });
}

export async function ensureTenantKdsScreen(tenantId, screenId, branchId = null) {
  if (!screenId) return null;
  return prisma.kDSScreen.findFirst({
    where: {
      id: Number(screenId),
      ...(branchId ? { branchId: Number(branchId) } : {}),
      branch: {
        tenantId,
      },
    },
    include: {
      branch: true,
    },
  });
}

export async function getDefaultKdsScreen(branchId) {
  if (!branchId) return null;
  return prisma.kDSScreen.findFirst({
    where: {
      branchId: Number(branchId),
      isActive: true,
      isDefault: true,
    },
    orderBy: { id: "asc" },
  });
}
