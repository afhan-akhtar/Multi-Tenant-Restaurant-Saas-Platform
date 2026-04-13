import { getTenantPrisma } from "./tenant-db";
import { createReceiptAccessToken } from "./receipt-access";

const KITCHEN_STATUSES = ["OPEN", "CONFIRMED", "PREPARING", "READY", "PACK"];

function getFilteredOrderItems(orderItems, screenId) {
  if (!screenId) {
    return orderItems || [];
  }

  return (orderItems || []).filter((item) =>
    (item.kdsItems || []).some((kdsItem) => kdsItem.screenId === screenId)
  );
}

function toNum(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  return Number(v);
}

export function serializeKDSOrder(order) {
  const orderItems = order.orderItems || [];
  return {
    ...order,
    receiptAccessToken: createReceiptAccessToken({
      orderId: order.id,
      tenantId: order.tenantId,
    }),
    subtotal: toNum(order.subtotal),
    taxAmount: toNum(order.taxAmount),
    discountAmount: toNum(order.discountAmount),
    tipAmount: toNum(order.tipAmount),
    grandTotal: toNum(order.grandTotal),
    orderItems: orderItems.map((item) => ({
      ...item,
      unitPrice: toNum(item.unitPrice),
      taxRate: toNum(item.taxRate),
      totalAmount: toNum(item.totalAmount),
    })),
  };
}

const KDS_ORDER_INCLUDE = {
  orderItems: {
    include: {
      kdsItems: {
        include: {
          screen: {
            select: {
              id: true,
              name: true,
              stationType: true,
            },
          },
        },
      },
    },
  },
  customer: true,
  table: true,
};

export async function getKDSOrders(tenantId, branchId = null, screenId = null) {
  if (!tenantId) return [];

  const prisma = await getTenantPrisma(tenantId);

  const where = {
    tenantId,
    ...(branchId && { branchId }),
    status: { in: KITCHEN_STATUSES },
    ...(screenId
      ? {
          orderItems: {
            some: {
              kdsItems: {
                some: {
                  screenId,
                },
              },
            },
          },
        }
      : {}),
  };

  const ordersRaw = await prisma.order.findMany({
    where,
    include: KDS_ORDER_INCLUDE,
    orderBy: { createdAt: "asc" },
  });

  return ordersRaw
    .map((order) => ({
      ...order,
      orderItems: getFilteredOrderItems(order.orderItems, screenId),
    }))
    .filter((order) => order.orderItems.length > 0 || !screenId)
    .map(serializeKDSOrder);
}

export async function getKDSOrderById(tenantId, orderId, screenId = null) {
  if (!tenantId || !orderId) return null;

  const prisma = await getTenantPrisma(tenantId);

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      tenantId,
      ...(screenId
        ? {
            orderItems: {
              some: {
                kdsItems: {
                  some: {
                    screenId,
                  },
                },
              },
            },
          }
        : {}),
    },
    include: KDS_ORDER_INCLUDE,
  });

  if (!order) return null;

  const filteredOrder = {
    ...order,
    orderItems: getFilteredOrderItems(order.orderItems, screenId),
  };

  if (screenId && filteredOrder.orderItems.length === 0) {
    return null;
  }

  return serializeKDSOrder(filteredOrder);
}
