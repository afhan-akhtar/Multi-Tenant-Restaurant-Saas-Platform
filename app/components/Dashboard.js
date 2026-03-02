"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import styles from "./Dashboard.module.css";

const METRIC_CONFIG = [
  { key: "revenue", label: "Revenue", icon: "revenue", color: "#3b82f6" },
  { key: "salesReturn", label: "Sales Return", icon: "return", color: "#f97316" },
  { key: "purchasesReturn", label: "Purchases Return", icon: "purchaseReturn", color: "#22c55e" },
  { key: "profit", label: "Profit", icon: "profit", color: "#3b82f6" },
  { key: "todaySales", label: "Today Sales", icon: "sales", color: "#64748b" },
  { key: "lowStockItems", label: "Low Stock Items", icon: "lowStock", color: "#ef4444" },
  { key: "totalCustomers", label: "Total Customers", icon: "customers", color: "#0ea5e9" },
  { key: "pendingOrders", label: "Pending Orders", icon: "pending", color: "#f97316" },
  { key: "avgOrderValue", label: "Avg Order Value", icon: "avgOrder", color: "#1e40af" },
  { key: "totalProducts", label: "Total Products", icon: "products", color: "#0ea5e9" },
  { key: "profitMargin", label: "Profit Margin", icon: "margin", color: "#22c55e" },
];

const ICON_SVG = {
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  ),
  return: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  purchaseReturn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  profit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  lowStock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  avgOrder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  margin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

function MetricCard({ label, value, icon, color }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon} style={{ background: `${color}22`, color }}>
        {ICON_SVG[icon] || ICON_SVG.revenue}
      </div>
      <div className={styles.metricContent}>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricLabel}>{label}</div>
      </div>
    </div>
  );
}

const defaultData = {
  metrics: {
    revenue: "Rs 0.00",
    salesReturn: "Rs 0.00",
    purchasesReturn: "Rs 0.00",
    profit: "Rs 0.00",
    todaySales: "Rs 0.00",
    lowStockItems: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    avgOrderValue: "Rs 0.00",
    totalProducts: 0,
    profitMargin: "0%",
  },
  paymentData: [],
  salesByCategoryData: [{ name: "No data", sales: 0 }],
  topProducts: [],
  lowStockItems: [],
  topCustomers: [],
  cashFlowData: [{ month: "No data", sent: 0, received: 0 }],
};

export default function Dashboard({ data = defaultData }) {
  const { metrics, paymentData, salesByCategoryData, topProducts, lowStockItems, topCustomers, cashFlowData } = data;

  const metricCards = METRIC_CONFIG.map((cfg) => ({
    ...cfg,
    value: metrics[cfg.key] ?? "0",
  }));

  const paymentChartData = paymentData?.length ? paymentData : [{ name: "No data", value: 100, color: "#94a3b8" }];
  const salesChartData = salesByCategoryData?.length ? salesByCategoryData : [{ name: "No data", sales: 0 }];
  const maxSales = Math.max(...salesChartData.map((d) => d.sales), 1);

  return (
    <div className={styles.dashboard}>
      <div className={styles.metricsGrid}>
        {metricCards.map((card) => (
          <MetricCard key={card.key} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Payment Method Breakdown (This Month)</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={paymentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Sales by Category (This Month)</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesChartData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
                <YAxis type="category" dataKey="name" width={90} />
                <Tooltip formatter={(v) => [`Rs ${Number(v).toLocaleString()}`, "Sales"]} />
                <Bar dataKey="sales" fill="#e94560" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.panelsRow}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Top Selling Products (This Month)</h3>
          {topProducts?.length > 0 ? (
            <div className={styles.topList}>
              {topProducts.map((p, i) => (
                <div key={i} className={styles.topRow}>
                  <span>{p.name}</span>
                  <span>Rs {Number(p.total).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.panelEmpty}>No sales this month</div>
          )}
        </div>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Low Stock Alert</h3>
          {lowStockItems?.length > 0 ? (
            <div className={styles.lowStockTable}>
              {lowStockItems.map((item, i) => (
                <div key={i} className={styles.lowStockRow}>
                  <span className={styles.lowStockProduct}>{item.product}</span>
                  <span className={`${styles.lowStockQty} ${item.stock === 0 ? styles.lowStockZero : ""}`}>{item.stock}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.panelEmpty}>All items in stock</div>
          )}
        </div>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Top Customers (This Month)</h3>
          {topCustomers?.length > 0 ? (
            <div className={styles.topList}>
              {topCustomers.map((c, i) => (
                <div key={i} className={styles.topRow}>
                  <span>{c.name}</span>
                  <span>Rs {Number(c.total).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.panelEmpty}>No customers this month</div>
          )}
        </div>
      </div>

      <div className={styles.cashFlowCard}>
        <h3 className={styles.chartTitle}>Monthly Cash Flow (Payment Sent & Received)</h3>
        <div className={styles.chartContainerLarge}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`Rs ${Number(value || 0).toLocaleString()}`, ""]} />
              <Legend />
              <Line type="monotone" dataKey="sent" name="Payment Sent" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="received" name="Payment Received" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
