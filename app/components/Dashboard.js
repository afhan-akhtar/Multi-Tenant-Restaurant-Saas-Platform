"use client";

import { useState, useEffect } from "react";
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
import { formatEur } from "@/lib/currencyFormat";
import QRDashboardFeed from "@/app/components/QRDashboardFeed";

// Per Module B: Real-time revenue, tax, and waiter performance analytics
const METRIC_CONFIG = [
  { key: "revenue", label: "Revenue", icon: "revenue", color: "#3b82f6" },
  { key: "taxCollected", label: "Tax Collected", icon: "tax", color: "#6366f1" },
  { key: "todaySales", label: "Today Sales", icon: "sales", color: "#64748b" },
  { key: "todayTax", label: "Today Tax", icon: "tax", color: "#8b5cf6" },
  { key: "salesReturn", label: "Sales Return", icon: "return", color: "#f97316" },
  { key: "profit", label: "Profit", icon: "profit", color: "#22c55e" },
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
  tax: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  return: (
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
    <div className="bg-white rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 shadow-sm border border-color-border transition-all duration-200 hover:shadow-md hover:-translate-y-px">
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 min-w-10 sm:min-w-12 rounded-[10px] flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6"
        style={{ background: `${color}22`, color }}
      >
        {ICON_SVG[icon] || ICON_SVG.revenue}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg sm:text-xl font-bold text-[#1a1d29] leading-tight truncate">{value}</div>
        <div className="text-xs sm:text-[0.85rem] text-color-text-muted mt-0.5 sm:mt-1">{label}</div>
      </div>
    </div>
  );
}

const defaultData = {
  metrics: {
    revenue: "€0.00",
    taxCollected: "€0.00",
    taxThisMonth: "€0.00",
    todaySales: "€0.00",
    todayTax: "€0.00",
    salesReturn: "€0.00",
    profit: "€0.00",
    totalCustomers: 0,
    pendingOrders: 0,
    avgOrderValue: "€0.00",
    totalProducts: 0,
    profitMargin: "0%",
  },
  paymentData: [],
  salesByCategoryData: [{ name: "No data", sales: 0 }],
  topProducts: [],
  lowStockItems: [],
  topCustomers: [],
  waiterPerformance: [],
  cashFlowData: [{ month: "No data", sent: 0, received: 0 }],
};

export default function Dashboard({ data = defaultData }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const { metrics, paymentData, salesByCategoryData, topProducts, topCustomers, waiterPerformance, cashFlowData } = data;

  const metricCards = METRIC_CONFIG.map((cfg) => ({
    ...cfg,
    value: metrics[cfg.key] ?? "0",
  }));

  const paymentChartData = paymentData?.length ? paymentData : [{ name: "No data", value: 100, color: "#94a3b8" }];
  const salesChartData = salesByCategoryData?.length ? salesByCategoryData : [{ name: "No data", sales: 0 }];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <QRDashboardFeed />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {metricCards.map((card) => (
          <MetricCard key={card.key} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border overflow-hidden">
          <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Payment Method Breakdown (This Month)</h3>
          <div className="h-[220px] sm:h-[260px] min-h-[180px] min-w-[200px] w-full">
            {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={180} initialDimension={{ width: 400, height: 220 }}>
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
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border overflow-hidden">
          <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Sales by Category (This Month)</h3>
          <div className="h-[220px] sm:h-[260px] min-h-[180px] min-w-[200px] w-full">
            {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={180} initialDimension={{ width: 400, height: 220 }}>
              <BarChart data={salesChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
                <Tooltip formatter={(v) => [formatEur(v), "Sales"]} />
                <Bar dataKey="sales" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border overflow-hidden">
          <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Top Selling Products (This Month)</h3>
          {topProducts?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center gap-2 py-2 text-sm border-b border-slate-100 last:border-0">
                  <span className="truncate min-w-0">{p.name}</span>
                  <span className="shrink-0">{formatEur(p.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-color-text-muted text-sm py-4 text-center">No sales this month</div>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border overflow-hidden">
          <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Waiter Performance (This Month)</h3>
          {waiterPerformance?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {waiterPerformance.map((w, i) => (
                <div key={i} className="flex justify-between items-center gap-2 py-2 text-sm border-b border-slate-100 last:border-0">
                  <span className="truncate min-w-0">{w.name}</span>
                  <span className="shrink-0 text-right">{formatEur(w.total)} ({w.orders})</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-color-text-muted text-sm py-4 text-center">No waiter data this month</div>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border overflow-hidden">
          <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Top Customers (This Month)</h3>
          {topCustomers?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topCustomers.map((c, i) => (
                <div key={i} className="flex justify-between items-center gap-2 py-2 text-sm border-b border-slate-100 last:border-0">
                  <span className="truncate min-w-0">{c.name}</span>
                  <span className="shrink-0">{formatEur(c.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-color-text-muted text-sm py-4 text-center">No customers this month</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border overflow-hidden">
        <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Monthly Cash Flow (Payment Sent & Received)</h3>
        <div className="h-[250px] sm:h-[300px] min-h-[200px] min-w-[200px] w-full">
          {mounted && (
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200} initialDimension={{ width: 400, height: 250 }}>
            <LineChart data={cashFlowData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} horizontal={true} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={{ stroke: "#e2e8f0" }} />
              <YAxis tickFormatter={(v) => Number(v || 0).toFixed(2)} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={{ stroke: "#e2e8f0" }} width={70} />
              <Tooltip formatter={(value) => [formatEur(value), ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />
              <Line type="monotone" dataKey="sent" name="Payment Sent" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="received" name="Payment Received" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
