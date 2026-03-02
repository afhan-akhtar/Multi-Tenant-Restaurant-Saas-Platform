"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import styles from "./DashboardLayout.module.css";

// Super Admin: Platform Governance (Module A)
const SUPER_ADMIN_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { section: "PLATFORM", items: [
    { href: "/restaurants", label: "Restaurant Management", icon: "restaurant" },
    { href: "/subscriptions", label: "Subscriptions & Plans", icon: "subscription" },
    { href: "/commission", label: "Commission & Billing", icon: "commission" },
  ]},
  { section: "AUDIT", items: [
    { href: "/logs", label: "Global Logs", icon: "logs" },
    { href: "/impersonation", label: "Impersonation", icon: "impersonate" },
  ]},
  { href: "/settings", label: "Settings", icon: "settings" },
];

// Restaurant Admin Panel (Module B)
const RESTAURANT_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { section: "MENU ENGINEERING", items: [
    { href: "/categories", label: "Categories", icon: "category" },
    { href: "/products", label: "Products", icon: "products" },
    { href: "/addons", label: "Add-on Groups", icon: "addon" },
  ]},
  { section: "STAFF & SECURITY", items: [
    { href: "/users", label: "Staff Management", icon: "users" },
    { href: "/roles", label: "Roles & Permissions", icon: "roles" },
  ]},
  { section: "FLOOR", items: [
    { href: "/tables", label: "Floor & Tables", icon: "table" },
  ]},
  { section: "REPORTING & ANALYTICS", items: [
    { href: "/reports", label: "Reports", icon: "reports" },
    { href: "/z-reports", label: "Z-Reports", icon: "zreport" },
    { href: "/cashbook", label: "Cashbook", icon: "cashbook" },
  ]},
  { section: "MARKETING (CRM)", items: [
    { href: "/segments", label: "Segments", icon: "segment" },
    { href: "/loyalty", label: "Loyalty Program", icon: "loyalty" },
    { href: "/campaigns", label: "Email Campaigns", icon: "campaign" },
    { href: "/parties", label: "Customers", icon: "contacts" },
  ]},
  { section: "POS & KITCHEN", items: [
    { href: "/pos", label: "POS System", icon: "pos" },
    { href: "/kds", label: "Kitchen Display (KDS)", icon: "kds" },
  ]},
  { href: "/settings", label: "Settings", icon: "settings" },
];

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="10" width="7" height="11" rx="1" />
      <rect x="3" y="14" width="7" height="6" rx="1" />
    </svg>
  ),
  restaurant: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
      <path d="M3 12h18" />
    </svg>
  ),
  subscription: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  commission: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  logs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  impersonate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M23 11h-6" />
    </svg>
  ),
  category: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  addon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  roles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15v2" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19 15a7 7 0 0 1-14 0" />
      <path d="M19 15h2" />
      <path d="M3 15h2" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <path d="M6 12h12" />
    </svg>
  ),
  delivery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 18H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2" />
      <path d="M19 18h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2" />
      <path d="M1 13h22" />
      <path d="M8 18v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  ),
  zreport: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  cashbook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  segment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M6 12h12" />
    </svg>
  ),
  loyalty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  campaign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  contacts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  pos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M6 21h12" />
      <path d="M10 17h4" />
    </svg>
  ),
  kds: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

function NavItem({ href, label, icon, isActive }) {
  return (
    <Link
      href={href || "#"}
      className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
    >
      <span className={styles.navIcon}>{ICONS[icon] || ICONS.dashboard}</span>
      <span className={styles.navLabel}>{label}</span>
    </Link>
  );
}

const PAGE_TITLES = {
  "/": "Dashboard",
  "/pos": "POS System",
  "/products": "Products",
  "/users": "Staff Management",
  "/profile": "Profile",
  "/parties": "Customers",
  "/reports": "Reports",
  "/cashbook": "Cashbook",
  "/settings": "Settings",
  "/restaurants": "Restaurant Management",
  "/subscriptions": "Subscriptions & Plans",
  "/commission": "Commission & Billing",
  "/logs": "Global Logs",
  "/impersonation": "Impersonation",
  "/categories": "Categories",
  "/addons": "Add-on Groups",
  "/roles": "Roles & Permissions",
  "/tables": "Floor & Tables",
  "/delivery-zones": "Delivery Zones",
  "/z-reports": "Z-Reports",
  "/segments": "Segments",
  "/loyalty": "Loyalty Program",
  "/campaigns": "Email Campaigns",
  "/kds": "Kitchen Display (KDS)",
};

export default function DashboardLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const isSuperAdmin = user?.type === "super_admin";

  const sidebarItems = isSuperAdmin ? SUPER_ADMIN_ITEMS : RESTAURANT_ITEMS;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const pageTitle = PAGE_TITLES[pathname] || pathname?.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";

  const displayName = isSuperAdmin
    ? "Super Admin"
    : (user?.name === "Demo Staff" ? "Restaurant Admin" : (user?.name || "User"));

  return (
    <div className={styles.wrapper}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className={styles.sidebarLogo}>
            <div className={styles.logoIcon}>R</div>
            <span className={styles.logoText}>Restaurant</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {sidebarItems.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className={styles.navSection}>
                  <div className={styles.navSectionTitle}>{item.section}</div>
                  {item.items.map((sub) => (
                    <NavItem
                      key={sub.href}
                      href={sub.href}
                      label={sub.label}
                      icon={sub.icon}
                      isActive={isActive(sub.href)}
                    />
                  ))}
                </div>
              );
            }
            return (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            );
          })}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className={styles.headerTitle}>{pageTitle}</h1>
          </div>
          <div className={styles.headerRight}>
            {!isSuperAdmin && (
              <Link href="/pos" className={styles.posButton}>POS System</Link>
            )}
            <button className={styles.iconButton} aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <div className={styles.userAvatar}>
                  {(displayName?.[0] || "U").toUpperCase()}
                </div>
                <span className={styles.userName}>{displayName}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  {isSuperAdmin && (
                    <Link href="/impersonation" onClick={() => setUserMenuOpen(false)}>Impersonate</Link>
                  )}
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                  <Link href="/settings" onClick={() => setUserMenuOpen(false)}>Settings</Link>
                  <button onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>

        <footer className={styles.footer}>
          Copyright © {new Date().getFullYear()} Multi-Tenant Restaurant SaaS. All Rights Reserved.
        </footer>
      </div>

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
