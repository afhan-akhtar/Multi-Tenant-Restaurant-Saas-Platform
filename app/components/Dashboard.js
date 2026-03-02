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

const METRIC_CARDS = [
  { label: "Revenue", value: "Rs 0.00", icon: "revenue", color: "#3b82f6" },
  { label: "Sales Return", value: "Rs 0.00", icon: "return", color: "#f97316" },
  { label: "Purchases Return", value: "Rs 0.00", icon: "purchaseReturn", color: "#22c55e" },
  { label: "Profit", value: "Rs 0.00", icon: "profit", color: "#3b82f6" },
  { label: "Today Sales", value: "Rs 0.00", icon: "sales", color: "#64748b" },
  { label: "Low Stock Items", value: "0", icon: "lowStock", color: "#ef4444" },
  { label: "Total Customers", value: "0", icon: "customers", color: "#0ea5e9" },
  { label: "Pending Orders", value: "0", icon: "pending", color: "#f97316" },
  { label: "Avg Order Value", value: "Rs 0.00", icon: "avgOrder", color: "#1e40af" },
  { label: "Total Products", value: "0", icon: "products", color: "#0ea5e9" },
  { label: "Profit Margin", value: "0%", icon: "margin", color: "#22c55e" },
];

const PAYMENT_DATA = [
  { name: "Cash", value: 45, color: "#22c55e" },
  { name: "Card", value: 30, color: "#3b82f6" },
  { name: "Stripe", value: 15, color: "#8b5cf6" },
  { name: "PayPal", value: 10, color: "#f97316" },
];

const SALES_BY_CATEGORY = [
  { name: "Appetizers", sales: 0.3 },
  { name: "Main Course", sales: 0.7 },
  { name: "Desserts", sales: 0.4 },
  { name: "Beverages", sales: 0.9 },
  { name: "Sides", sales: 0.2 },
];

const CASH_FLOW_DATA = [
  { month: "04 2025", sent: 100000, received: 80000 },
  { month: "07 2025", sent: 250000, received: 120000 },
  { month: "10 2025", sent: 150000, received: 180000 },
  { month: "01 2026", sent: 80000, received: 420000 },
  { month: "04 2026", sent: 120000, received: 200000 },
  { month: "07 2026", sent: 90000, received: 150000 },
];

const LOW_STOCK_ITEMS = [
  { product: "Wash Basic", stock: 0 },
  { product: "Tile Vanity", stock: 0 },
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

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Metric cards grid */}
      <div className={styles.metricsGrid}>
        {METRIC_CARDS.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Payment Method Breakdown (This Month)</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={PAYMENT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {PAYMENT_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
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
              <BarChart data={SALES_BY_CATEGORY} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => v.toFixed(1)} />
                <YAxis type="category" dataKey="name" width={70} />
                <Tooltip />
                <Bar dataKey="sales" fill="#e94560" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Panels row */}
      <div className={styles.panelsRow}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Top Selling Products (This Month)</h3>
          <div className={styles.panelEmpty}>No sales this month</div>
        </div>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Low Stock Alert</h3>
          <div className={styles.lowStockTable}>
            {LOW_STOCK_ITEMS.map((item) => (
              <div key={item.product} className={styles.lowStockRow}>
                <span className={styles.lowStockProduct}>{item.product}</span>
                <span className={`${styles.lowStockQty} ${item.stock === 0 ? styles.lowStockZero : ""}`}>
                  {item.stock}
                </span>
              </div>
            ))}
            {LOW_STOCK_ITEMS.length === 0 && (
              <div className={styles.panelEmpty}>All items in stock</div>
            )}
          </div>
        </div>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Top Customers (This Month)</h3>
          <div className={styles.panelEmpty}>No customers this month</div>
        </div>
      </div>

      {/* Cash flow chart */}
      <div className={styles.cashFlowCard}>
        <h3 className={styles.chartTitle}>Monthly Cash Flow (Payment Sent & Received)</h3>
        <div className={styles.chartContainerLarge}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={CASH_FLOW_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`Rs ${value?.toLocaleString()}`, ""]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="sent"
                name="Payment Sent"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="received"
                name="Payment Received"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
