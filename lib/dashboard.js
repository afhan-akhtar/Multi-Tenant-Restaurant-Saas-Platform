import { prisma } from "./db";

const Rs = (n) => `Rs ${Number(n || 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`;

function toNum(d) {
  return d ? Number(d) : 0;
}

export async function getDashboardData(tenantId = null, userType = "staff") {
  const tenantFilter = tenantId ? { tenantId } : {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const completedFilter = { ...tenantFilter, status: "COMPLETED" };
  const refundedFilter = { ...tenantFilter, status: "REFUNDED" };

  const [
    orders,
    refundedOrders,
    todayOrders,
    pendingOrders,
    customers,
    products,
    paymentsThisMonth,
    orderItemsByProduct,
    orderItemsByCategory,
    cashbookEntries,
    taxAggregate,
    waiterPerformanceRaw,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: completedFilter,
      _sum: { grandTotal: true, taxAmount: true, subtotal: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: refundedFilter,
      _sum: { grandTotal: true },
    }),
    prisma.order.aggregate({
      where: { ...completedFilter, createdAt: { gte: today } },
      _sum: { grandTotal: true, taxAmount: true },
    }),
    prisma.order.count({
      where: {
        ...tenantFilter,
        status: { in: ["OPEN", "CONFIRMED", "PREPARING", "READY"] },
      },
    }),
    prisma.customer.count({ where: tenantFilter }),
    prisma.product.count({ where: { ...tenantFilter, isActive: true } }),
    prisma.payment.groupBy({
      by: ["method"],
      where: {
        order: { ...tenantFilter, createdAt: { gte: monthStart } },
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      where: {
        order: {
          ...tenantFilter,
          status: "COMPLETED",
          createdAt: { gte: monthStart },
        },
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          ...tenantFilter,
          status: "COMPLETED",
          createdAt: { gte: monthStart },
        },
      },
      _sum: { totalAmount: true },
    }),
    prisma.cashbookEntry.findMany({
      where: tenantFilter,
      orderBy: { createdAt: "asc" },
    }),
    // Tax analytics
    prisma.order.aggregate({
      where: { ...completedFilter, createdAt: { gte: monthStart } },
      _sum: { taxAmount: true },
    }),
    // Waiter performance (orders with session -> waiter)
    prisma.order.groupBy({
      by: ["sessionId"],
      where: {
        ...tenantFilter,
        status: "COMPLETED",
        createdAt: { gte: monthStart },
      },
      _sum: { grandTotal: true },
      _count: true,
    }),
  ]);

  // Resolve waiter names from sessions
  let waiterPerformance = [];
  if (waiterPerformanceRaw.length > 0) {
    const sessionIds = waiterPerformanceRaw.map((w) => w.sessionId);
    const sessions = await prisma.session.findMany({
      where: { id: { in: sessionIds } },
      include: { waiter: true },
    });
    const sessionToWaiter = {};
    sessions.forEach((s) => {
      sessionToWaiter[s.id] = s.waiter?.name || "Unknown";
    });
    const waiterTotals = {};
    waiterPerformanceRaw.forEach((w) => {
      const name = sessionToWaiter[w.sessionId] || "Unknown";
      waiterTotals[name] = waiterTotals[name] || { total: 0, count: 0 };
      waiterTotals[name].total += toNum(w._sum.grandTotal);
      waiterTotals[name].count += w._count;
    });
    waiterPerformance = Object.entries(waiterTotals)
      .map(([name, d]) => ({ name, total: d.total, orders: d.count }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  const productIds = orderItemsByCategory.map((p) => p.productId);
  const productCategoryMap = {};
  if (productIds.length > 0) {
    const productsWithCat = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
    productsWithCat.forEach((p) => {
      productCategoryMap[p.id] = p.category?.name || "Other";
    });
  }

  const categorySales = {};
  orderItemsByCategory.forEach((item) => {
    const cat = productCategoryMap[item.productId] || "Other";
    categorySales[cat] = (categorySales[cat] || 0) + toNum(item._sum.totalAmount);
  });

  const salesByCategoryData = Object.entries(categorySales).map(([name, sales]) => ({ name, sales }));

  const totalPayments = paymentsThisMonth.reduce((s, p) => s + toNum(p._sum.amount), 0);
  const paymentData = paymentsThisMonth.map((p) => ({
    name: p.method,
    value: totalPayments > 0 ? Math.round((toNum(p._sum.amount) / totalPayments) * 100) : 0,
    amount: toNum(p._sum.amount),
    color: { CASH: "#22c55e", CARD: "#3b82f6", STRIPE: "#8b5cf6", PAYPAL: "#f97316" }[p.method] || "#64748b",
  }));

  const topProducts = orderItemsByProduct
    .sort((a, b) => toNum(b._sum.totalAmount) - toNum(a._sum.totalAmount))
    .slice(0, 5)
    .map((p) => ({ name: p.productName, total: toNum(p._sum.totalAmount), count: p._count }));

  const topCustomersData = await prisma.order.groupBy({
    by: ["customerId"],
    where: {
      ...tenantFilter,
      status: "COMPLETED",
      createdAt: { gte: monthStart },
    },
    _sum: { grandTotal: true },
  });

  const customerIds = topCustomersData.map((c) => c.customerId);
  const customersMap = {};
  if (customerIds.length > 0) {
    const custs = await prisma.customer.findMany({
      where: { id: { in: customerIds } },
    });
    custs.forEach((c) => {
      customersMap[c.id] = c.name;
    });
  }

  const topCustomers = topCustomersData
    .sort((a, b) => toNum(b._sum.grandTotal) - toNum(a._sum.grandTotal))
    .slice(0, 5)
    .map((c) => ({
      name: customersMap[c.customerId] || "Unknown",
      total: toNum(c._sum.grandTotal),
    }));

  const cashFlowByMonth = {};
  cashbookEntries.forEach((e) => {
    const d = new Date(e.createdAt);
    const key = `${String(d.getMonth() + 1).padStart(2, "0")} ${d.getFullYear()}`;
    if (!cashFlowByMonth[key]) cashFlowByMonth[key] = { sent: 0, received: 0 };
    const amt = toNum(e.amount);
    const t = (e.type || "").toLowerCase();
    if (t === "sent" || t === "expense" || t === "out") {
      cashFlowByMonth[key].sent += amt;
    } else {
      cashFlowByMonth[key].received += amt;
    }
  });

  let cashFlowData = Object.entries(cashFlowByMonth)
    .map(([month, v]) => ({ month, sent: v.sent, received: v.received }))
    .sort((a, b) => {
      const [ma, ya] = a.month.split(" ").map(Number);
      const [mb, yb] = b.month.split(" ").map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    });

  if (cashFlowData.length === 0 && orders._count > 0) {
    const orderMonths = await prisma.order.findMany({
      where: tenantFilter,
      select: { grandTotal: true, status: true, createdAt: true },
    });
    const byMonth = {};
    orderMonths.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${String(d.getMonth() + 1).padStart(2, "0")} ${d.getFullYear()}`;
      if (!byMonth[key]) byMonth[key] = { sent: 0, received: 0 };
      const amt = toNum(o.grandTotal);
      if (o.status === "COMPLETED") byMonth[key].received += amt;
    });
    cashFlowData = Object.entries(byMonth)
      .map(([month, v]) => ({ month, sent: v.sent, received: v.received }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split(" ").map(Number);
        const [mb, yb] = b.month.split(" ").map(Number);
        return ya !== yb ? ya - yb : ma - mb;
      });
  }
  if (cashFlowData.length === 0) {
    cashFlowData = [{ month: "No data", sent: 0, received: 0 }];
  }

  const revenue = toNum(orders._sum.grandTotal);
  const taxCollected = toNum(orders._sum.taxAmount);
  const taxThisMonth = toNum(taxAggregate._sum.taxAmount);
  const salesReturn = toNum(refundedOrders._sum.grandTotal);
  const todaySales = toNum(todayOrders._sum.grandTotal);
  const todayTax = toNum(todayOrders._sum.taxAmount);
  const avgOrderValue = orders._count > 0 ? revenue / orders._count : 0;

  return {
    userType: "restaurant",
    metrics: {
      revenue: Rs(revenue),
      taxCollected: Rs(taxCollected),
      taxThisMonth: Rs(taxThisMonth),
      todaySales: Rs(todaySales),
      todayTax: Rs(todayTax),
      salesReturn: Rs(salesReturn),
      profit: Rs(revenue - salesReturn),
      totalCustomers: customers,
      pendingOrders: pendingOrders,
      avgOrderValue: Rs(avgOrderValue),
      totalProducts: products,
      profitMargin: revenue > 0 ? `${Math.round(((revenue - salesReturn) / revenue) * 100)}%` : "0%",
    },
    paymentData,
    salesByCategoryData: salesByCategoryData.length ? salesByCategoryData : [{ name: "No data", sales: 0 }],
    topProducts,
    lowStockItems: [],
    topCustomers,
    waiterPerformance,
    cashFlowData: cashFlowData.length ? cashFlowData : [{ month: "N/A", sent: 0, received: 0 }],
  };
}

/** Super Admin platform-wide dashboard */
export async function getSuperAdminDashboardData() {
  const [tenantStats, subscriptionStats, orderStats, recentTenants] = await Promise.all([
    prisma.tenant.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.tenantSubscription.count({
      where: { status: "ACTIVE" },
    }),
    prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { grandTotal: true },
      _count: true,
    }),
    prisma.tenant.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    }),
  ]);

  const tenantsByStatus = Object.fromEntries(tenantStats.map((t) => [t.status, t._count]));
  const totalTenants = tenantStats.reduce((s, t) => s + t._count, 0);
  const activeTenants = tenantsByStatus.ACTIVE || 0;
  const blockedTenants = tenantsByStatus.BLOCKED || 0;

  return {
    userType: "super_admin",
    metrics: {
      totalTenants: totalTenants,
      activeTenants: activeTenants,
      blockedTenants: blockedTenants,
      activeSubscriptions: subscriptionStats,
      platformRevenue: Rs(toNum(orderStats._sum.grandTotal)),
      totalOrders: orderStats._count,
      commissionEarned: Rs(0), // TODO: implement commission logic
    },
    recentTenants: recentTenants.map((t) => ({
      name: t.name,
      subdomain: t.subdomain,
      status: t.status,
      orderCount: t._count.orders,
    })),
    paymentData: [],
    salesByCategoryData: [{ name: "No data", sales: 0 }],
    topProducts: [],
    lowStockItems: [],
    topCustomers: [],
    waiterPerformance: [],
    cashFlowData: [{ month: "No data", sent: 0, received: 0 }],
  };
}
