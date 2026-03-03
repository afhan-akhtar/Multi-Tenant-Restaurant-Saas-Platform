import { prisma } from "./db";

function toNum(d) {
  return d ? Number(d) : 0;
}

/** Sales reports with date range */
export async function getSalesReport(tenantId, startDate, endDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const where = { tenantId, status: "COMPLETED", createdAt: { gte: start, lte: end } };

  const [orders, itemsByProduct, dailyOrders, paymentMethods] = await Promise.all([
    prisma.order.aggregate({
      where,
      _sum: { grandTotal: true, taxAmount: true, subtotal: true, discountAmount: true },
      _count: true,
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      where: { order: where },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.findMany({
      where,
      select: { grandTotal: true, createdAt: true },
    }),
    prisma.payment.groupBy({
      by: ["method"],
      where: { order: where, status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  const topProducts = itemsByProduct
    .sort((a, b) => toNum(b._sum.totalAmount) - toNum(a._sum.totalAmount))
    .slice(0, 10)
    .map((p) => ({
      name: p.productName,
      revenue: toNum(p._sum.totalAmount),
      quantity: p._count,
    }));

  const byDate = {};
  dailyOrders.forEach((o) => {
    const d = new Date(o.createdAt).toISOString().slice(0, 10);
    if (!byDate[d]) byDate[d] = { revenue: 0, orders: 0 };
    byDate[d].revenue += toNum(o.grandTotal);
    byDate[d].orders += 1;
  });
  const salesByDay = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  const payments = paymentMethods.map((p) => ({
    method: p.method,
    amount: toNum(p._sum.amount),
  }));

  return {
    summary: {
      revenue: toNum(orders._sum.grandTotal),
      tax: toNum(orders._sum.taxAmount),
      discount: toNum(orders._sum.discountAmount),
      orders: orders._count,
    },
    topProducts,
    salesByDay,
    payments,
  };
}

/** Z-Report: Daily sales summary (German TSE-compliant style) */
export async function getZReportData(tenantId, date) {
  const d = new Date(date);
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);

  const where = {
    tenantId,
    status: "COMPLETED",
    createdAt: { gte: start, lte: end },
  };

  const [orders, payments, cashbook] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { orderItems: true, payments: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.payment.groupBy({
      by: ["method"],
      where: { order: where, status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.cashbookEntry.findMany({
      where: {
        tenantId,
        createdAt: { gte: start, lte: end },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const revenue = orders.reduce((s, o) => s + toNum(o.grandTotal), 0);
  const tax = orders.reduce((s, o) => s + toNum(o.taxAmount), 0);
  const subtotal = orders.reduce((s, o) => s + toNum(o.subtotal), 0);

  const paymentBreakdown = payments.map((p) => ({
    method: p.method,
    amount: toNum(p._sum.amount),
  }));

  return {
    date: d.toISOString().slice(0, 10),
    orders,
    summary: {
      grossRevenue: revenue,
      netSubtotal: subtotal,
      taxAmount: tax,
      orderCount: orders.length,
    },
    paymentBreakdown,
    cashbookEntries: cashbook,
  };
}
