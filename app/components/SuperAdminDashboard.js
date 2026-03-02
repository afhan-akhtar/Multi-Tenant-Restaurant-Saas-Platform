"use client";

import styles from "./Dashboard.module.css";

const METRIC_CONFIG = [
  { key: "totalTenants", label: "Total Restaurants", icon: "restaurant", color: "#3b82f6" },
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
    <div className={styles.metricCard}>
      <div className={styles.metricIcon} style={{ background: `${color}22`, color }}>
        {ICON_SVG[icon] || ICON_SVG.restaurant}
      </div>
      <div className={styles.metricContent}>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricLabel}>{label}</div>
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

  return (
    <div className={styles.dashboard}>
      <div className={styles.metricsGrid}>
        {metricCards.map((card) => (
          <MetricCard key={card.key} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      <div className={styles.panelsRow}>
        <div className={styles.panel} style={{ gridColumn: "span 3" }}>
          <h3 className={styles.panelTitle}>Recently Onboarded Restaurants</h3>
          {recentTenants?.length > 0 ? (
            <div className={styles.topList}>
              {recentTenants.map((t, i) => (
                <div key={i} className={styles.topRow}>
                  <span>{t.name} ({t.subdomain})</span>
                  <span>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: 6,
                        background: t.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color: t.status === "ACTIVE" ? "#166534" : "#991b1b",
                        fontSize: "0.8rem",
                        marginRight: "0.5rem",
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
            <div className={styles.panelEmpty}>No restaurants yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
