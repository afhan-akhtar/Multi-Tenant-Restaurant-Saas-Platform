import { prisma } from "@/lib/db";

function getKdsItemStatus(orderStatus) {
  if (orderStatus === "READY") return "READY";
  if (orderStatus === "PACK" || orderStatus === "COMPLETED") return "DISPATCHED";
  if (orderStatus === "PREPARING") return "COOKING";
  return "CREATED";
}

function pickFallbackScreens(screens) {
  const defaultScreens = screens.filter((screen) => screen.isDefault);
  if (defaultScreens.length > 0) {
    return defaultScreens;
  }

  const mainScreens = screens.filter((screen) => screen.stationType === "MAIN");
  if (mainScreens.length > 0) {
    return mainScreens;
  }

  return screens.slice(0, 1);
}

function resolveScreenIdsForStation(screens, stationType) {
  if (!screens.length) return [];

  if (!stationType || stationType === "MAIN") {
    return pickFallbackScreens(screens).map((screen) => screen.id);
  }

  const exactMatches = screens.filter((screen) => screen.stationType === stationType);
  if (exactMatches.length > 0) {
    return exactMatches.map((screen) => screen.id);
  }

  return pickFallbackScreens(screens).map((screen) => screen.id);
}

export async function syncKdsItemsForOrder({
  orderId,
  branchId,
  orderStatus,
  orderItems,
  productStationsByProductId = new Map(),
}) {
  if (!orderId || !branchId || !Array.isArray(orderItems) || orderItems.length === 0) {
    return;
  }

  const screens = await prisma.kDSScreen.findMany({
    where: {
      branchId,
      isActive: true,
    },
    select: {
      id: true,
      stationType: true,
      isDefault: true,
    },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });

  if (!screens.length) {
    return;
  }

  const kdsStatus = getKdsItemStatus(orderStatus);
  const rows = [];

  for (const item of orderItems) {
    const stationType = productStationsByProductId.get(item.productId) || "MAIN";
    const screenIds = resolveScreenIdsForStation(screens, stationType);

    for (const screenId of screenIds) {
      rows.push({
        orderItemId: item.id,
        screenId,
        status: kdsStatus,
      });
    }
  }

  if (!rows.length) {
    return;
  }

  await prisma.kDSItem.createMany({
    data: rows,
  });
}

export async function syncOrderKdsItemStatus(orderId, orderStatus) {
  if (!orderId) return;
  await prisma.kDSItem.updateMany({
    where: {
      orderItem: {
        orderId,
      },
    },
    data: {
      status: getKdsItemStatus(orderStatus),
    },
  });
}

export async function clearOrderKdsItems(orderId) {
  if (!orderId) return;
  await prisma.kDSItem.deleteMany({
    where: {
      orderItem: {
        orderId,
      },
    },
  });
}
