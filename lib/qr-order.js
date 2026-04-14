import crypto from "crypto";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getNextOrderNumber, getOrCreateWalkInCustomer } from "@/lib/pos";
import { getKDSOrderById } from "@/lib/kds";
import { syncKdsItemsForOrder } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import { markDiningTableOccupied } from "@/lib/dining-table-availability";
import { resolveDeviceStaffId } from "@/lib/device-auth";

function toNum(d) {
  return d ? Number(d) : 0;
}

/**
 * Build line items from client payload using authoritative product/add-on prices from DB.
 * Each item: { productId, quantity, addonItemIds?: number[] }
 */
export async function buildQrOrderLines(tenantId, items) {
  const prisma = await getTenantPrisma(tenantId);
  if (!items?.length) {
    throw new Error("Order must have items");
  }

  const productIds = [...new Set(items.map((i) => Number(i.productId)).filter(Boolean))];
  const products = await prisma.product.findMany({
    where: { tenantId, id: { in: productIds }, isActive: true },
    include: { variants: true },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  const allAddonIds = [
    ...new Set(items.flatMap((i) => (Array.isArray(i.addonItemIds) ? i.addonItemIds.map(Number) : []))),
  ].filter(Boolean);

  const addonRows =
    allAddonIds.length > 0
      ? await prisma.addonItem.findMany({
          where: { id: { in: allAddonIds } },
          include: { group: { select: { tenantId: true } } },
        })
      : [];

  const addonById = new Map(addonRows.map((a) => [a.id, a]));
  for (const a of addonRows) {
    if (a.group?.tenantId !== tenantId) {
      throw new Error("Invalid add-on selection");
    }
  }

  const lines = [];
  for (const raw of items) {
    const productId = Number(raw.productId);
    const qty = Math.min(99, Math.max(1, parseInt(String(raw.quantity || 1), 10) || 1));
    const product = productById.get(productId);
    if (!product) {
      throw new Error(`Product not available: ${productId}`);
    }

    let addonTotal = 0;
    const addonItemIds = Array.isArray(raw.addonItemIds) ? raw.addonItemIds.map(Number) : [];
    for (const aid of addonItemIds) {
      const addon = addonById.get(aid);
      if (!addon) {
        throw new Error("Invalid add-on");
      }
      addonTotal += toNum(addon.price);
    }

    const unitBase = toNum(product.basePrice);
    const unitPrice = unitBase + addonTotal;

    lines.push({
      productId: product.id,
      productName: product.name,
      unitPrice,
      taxRate: toNum(product.taxRate),
      quantity: qty,
      addonTotal,
    });
  }

  return lines;
}

/**
 * Create a dine-in order from the customer QR menu (no staff login). Uses same Order/KDS pipeline as POS/tablet.
 */
export async function createQrTableOrder({
  tenantId,
  tableId,
  items,
  customerName = "",
  notes = "",
}) {
  if (!tenantId || !tableId) {
    throw new Error("tenantId and tableId are required");
  }

  const prisma = await getTenantPrisma(tenantId);

  const table = await prisma.diningTable.findFirst({
    where: { tenantId, id: tableId },
  });
  if (!table) {
    throw new Error("Table not found");
  }

  const branchId = table.branchId;
  const staffId = await resolveDeviceStaffId(tenantId, branchId);
  if (!staffId) {
    throw new Error("No staff member available to assign this order");
  }

  const lineInputs = await buildQrOrderLines(tenantId, items);

  const productIds = [...new Set(lineInputs.map((l) => l.productId))];
  const products = await prisma.product.findMany({
    where: { tenantId, id: { in: productIds } },
    select: { id: true, kdsStation: true },
  });
  const productStationsByProductId = new Map(products.map((p) => [p.id, p.kdsStation || "MAIN"]));

  const customer = await getOrCreateWalkInCustomer(tenantId);

  const orderLines = lineInputs.map((item) => {
    const price = item.unitPrice;
    const qty = item.quantity || 1;
    const total = price * qty;
    return {
      productId: item.productId,
      productName: item.productName,
      name: item.productName,
      unitPrice: price,
      price,
      taxRate: item.taxRate,
      quantity: qty,
      totalAmount: total,
      status: "OPEN",
    };
  });

  let subtotal = 0;
  for (const row of orderLines) {
    subtotal += row.totalAmount;
  }

  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  const orderNumber = `QR-${await getNextOrderNumber(tenantId, branchId)}`;
  const qrClientToken = crypto.randomBytes(24).toString("hex");

  const guestParts = [];
  if (customerName && String(customerName).trim()) {
    guestParts.push(`Guest: ${String(customerName).trim().slice(0, 120)}`);
  }
  if (notes && String(notes).trim()) {
    guestParts.push(String(notes).trim().slice(0, 500));
  }
  const guestNotes = guestParts.length ? guestParts.join(" · ") : null;

  const now = new Date();
  const session = await prisma.session.create({
    data: {
      tenantId,
      branchId,
      tableId: table.id,
      waiterId: staffId,
      openedAt: now,
    },
  });

  const order = await prisma.order.create({
    data: {
      tenantId,
      branchId,
      sessionId: session.id,
      tableId: table.id,
      customerId: customer.id,
      orderNumber,
      orderType: "DINE_IN",
      status: "OPEN",
      subtotal,
      taxAmount,
      discountAmount: 0,
      tipAmount: 0,
      totalAmount: grandTotal,
      grandTotal,
      orderSource: "QR",
      guestNotes,
      qrClientToken,
      orderItems: {
        create: orderLines,
      },
    },
    include: { orderItems: true },
  });

  await markDiningTableOccupied(tenantId, table.id);

  await syncKdsItemsForOrder({
    tenantId,
    orderId: order.id,
    branchId,
    orderStatus: order.status,
    orderItems: order.orderItems,
    productStationsByProductId,
  });

  const kdsOrder = await getKDSOrderById(tenantId, order.id);
  if (kdsOrder) {
    broadcastTenantKdsEvent(tenantId, "order.created", { order: kdsOrder });
  }

  return { order, orderNumber, qrClientToken, kdsOrder };
}
