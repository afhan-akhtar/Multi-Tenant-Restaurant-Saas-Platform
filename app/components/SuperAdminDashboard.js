"use client";

import Link from "next/link";

const METRIC_CONFIG = [
  { key: "totalTenants", label: "Total Restaurants", icon: "restaurant", color: "#3b82f6" },
  { key: "pendingTenants", label: "Pending Approval", icon: "pending", color: "#f59e0b" },
  { key: "activeTenants", label: "Active Restaurants", icon: "check", color: "#22c55e" },
  { key: "blockedTenants", label: "Blocked", icon: "block", color: "#ef4444" },
  { key: "activeSubscriptions", label: "Active Subscriptions", icon: "subscription", color: "#8b5cf6" },
  { key: "platformRevenue", label: "Platform Revenue", icon: "revenue", color: "#0ea5e9" },
  { key: "totalOrders", label: "Total Orders", icon: "orders", color: "#64748b" },
  { key: "commissionEarned", label: "Commission Earned", icon: "commission", color: "#f97316" },
];

const ICON_SVG = {
  restaurant: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  block: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93l14.14 14.14" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  subscription: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  commission: (
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
        {ICON_SVG[icon] || ICON_SVG.restaurant}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg sm:text-xl font-bold text-[#1a1d29] leading-tight truncate">{value}</div>
        <div className="text-xs sm:text-[0.85rem] text-color-text-muted mt-0.5 sm:mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard({ data }) {
  const { metrics = {}, recentTenants = [] } = data || {};

  const metricCards = METRIC_CONFIG.map((cfg) => ({
    ...cfg,
    value: metrics[cfg.key] ?? "0",
  }));

  const pendingCount = Number(metrics?.pendingTenants ?? 0);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {pendingCount > 0 && (
        <Link
          href="/admin/restaurants?tab=pending"
          className="block p-4 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/15 transition-colors no-underline"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/20 text-amber-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h3 className="m-0 text-base font-semibold text-amber-800 dark:text-amber-200">
                  {pendingCount} Restaurant{pendingCount !== 1 ? "s" : ""} Awaiting Approval
                </h3>
                <p className="m-0 text-sm text-amber-700/80 dark:text-amber-300/80">
                  Review and approve or reject new registrations
                </p>
              </div>
            </div>
            <span className="py-2 px-4 bg-amber-500 text-white rounded-lg text-sm font-medium shrink-0">
              Review Now →
            </span>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {metricCards.map((card) => (
          <MetricCard key={card.key} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-color-border xl:col-span-3 overflow-hidden">
          <h3 className="text-sm sm:text-base font-semibold text-color-text m-0 mb-3 sm:mb-4">Recently Onboarded Restaurants</h3>
          {recentTenants?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {recentTenants.map((t, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 text-sm border-b border-slate-100 last:border-0">
                  <span className="truncate min-w-0">{t.name} ({t.subdomain})</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span
                      className="py-0.5 px-2 rounded-md text-xs font-medium"
                      style={{
                        background: t.status === "ACTIVE" ? "#dcfce7" : t.status === "PENDING" ? "#fef3c7" : "#fee2e2",
                        color: t.status === "ACTIVE" ? "#166534" : t.status === "PENDING" ? "#b45309" : "#991b1b",
                      }}
                    >
                      {t.status}
                    </span>
                    {t.orderCount} orders
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-color-text-muted text-sm py-4 text-center">No restaurants yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
