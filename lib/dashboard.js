import { prisma } from "./db";

const Rs = (n) => `Rs ${Number(n || 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`;

function toNum(d) {
  return d ? Number(d) : 0;
}

export async function getDashboardData(tenantId = null) {
  const tenantFilter = tenantId ? { tenantId } : {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Completed orders for revenue metrics
  const completedFilter = { ...tenantFilter, status: "COMPLETED" };
  const refundedFilter = { ...tenantFilter, status: "REFUNDED" };

  const [orders, refundedOrders, todayOrders, pendingOrders, customers, products, paymentsThisMonth, orderItemsByProduct, orderItemsByCategory, cashbookEntries] = await Promise.all([
    // Total revenue from completed orders
    prisma.order.aggregate({
      where: completedFilter,
      _sum: { grandTotal: true },
      _count: true,
    }),
    // Refunded (sales return)
    prisma.order.aggregate({
      where: refundedFilter,
      _sum: { grandTotal: true },
    }),
    // Today's sales
    prisma.order.aggregate({
      where: { ...completedFilter, createdAt: { gte: today } },
      _sum: { grandTotal: true },
    }),
    // Pending orders (OPEN, CONFIRMED, PREPARING, READY)
    prisma.order.count({
      where: {
        ...tenantFilter,
        status: { in: ["OPEN", "CONFIRMED", "PREPARING", "READY"] },
      },
    }),
    prisma.customer.count({ where: tenantFilter }),
    prisma.product.count({ where: { ...tenantFilter, isActive: true } }),
    // Payment method breakdown this month
    prisma.payment.groupBy({
      by: ["method"],
      where: {
        order: { ...tenantFilter, createdAt: { gte: monthStart } },
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
    // Top selling products this month (by quantity)
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
    // Sales by category this month
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
    // Cash flow for chart
    prisma.cashbookEntry.findMany({
      where: tenantFilter,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Get category names for products
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

  // Aggregate by category
  const categorySales = {};
  orderItemsByCategory.forEach((item) => {
    const cat = productCategoryMap[item.productId] || "Other";
    categorySales[cat] = (categorySales[cat] || 0) + toNum(item._sum.totalAmount);
  });

  const salesByCategoryData = Object.entries(categorySales).map(([name, sales]) => ({
    name,
    sales: sales,
  }));

  // Payment method breakdown
  const totalPayments = paymentsThisMonth.reduce((s, p) => s + toNum(p._sum.amount), 0);
  const paymentData = paymentsThisMonth.map((p) => ({
    name: p.method,
    value: totalPayments > 0 ? Math.round((toNum(p._sum.amount) / totalPayments) * 100) : 0,
    amount: toNum(p._sum.amount),
    color: { CASH: "#22c55e", CARD: "#3b82f6", STRIPE: "#8b5cf6", PAYPAL: "#f97316" }[p.method] || "#64748b",
  }));

  // Top selling products
  const topProducts = orderItemsByProduct
    .sort((a, b) => toNum(b._sum.totalAmount) - toNum(a._sum.totalAmount))
    .slice(0, 5)
    .map((p) => ({ name: p.productName, total: toNum(p._sum.totalAmount), count: p._count }));

  // Top customers this month (by order total)
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

  // Monthly cash flow - group cashbook by month
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

  // Use orders as proxy for cash flow if no cashbook entries
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
  const salesReturn = toNum(refundedOrders._sum.grandTotal);
  const todaySales = toNum(todayOrders._sum.grandTotal);
  const avgOrderValue = orders._count > 0 ? revenue / orders._count : 0;

  return {
    metrics: {
      revenue: Rs(revenue),
      salesReturn: Rs(salesReturn),
      purchasesReturn: Rs(0),
      profit: Rs(revenue - salesReturn),
      todaySales: Rs(todaySales),
      lowStockItems: 0,
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
    cashFlowData: cashFlowData.length ? cashFlowData : [{ month: "N/A", sent: 0, received: 0 }],
  };
}
