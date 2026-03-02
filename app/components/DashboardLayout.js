"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import styles from "./DashboardLayout.module.css";

const SIDEBAR_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/pos", label: "POS System", icon: "pos" },
  { href: "/sales", label: "Sales", icon: "sales" },
  { href: "/purchases", label: "Purchases", icon: "purchases" },
  { section: "INVENTORY", items: [
    { href: "/products", label: "Products", icon: "products" },
    { href: "/stock", label: "Stock Adjustments", icon: "stock" },
  ]},
  { section: "SALES & RETURNS", items: [
    { href: "/quotations", label: "Quotations", icon: "quote" },
    { href: "/sale-returns", label: "Sale Returns", icon: "return" },
    { href: "/purchase-returns", label: "Purchase Returns", icon: "return" },
  ]},
  { section: "CONTACTS", items: [
    { href: "/parties", label: "Parties", icon: "contacts" },
  ]},
  { section: "FINANCIAL", items: [
    { href: "/expenses", label: "Expenses", icon: "expense" },
  ]},
  { section: "REPORTS", items: [
    { href: "/reports", label: "Reports", icon: "reports" },
  ]},
  { section: "SYSTEM", items: [
    { href: "/users", label: "User Management", icon: "users" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ]},
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
  pos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M6 21h12" />
      <path d="M10 17h4" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-4-4-3 3" />
    </svg>
  ),
  purchases: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  stock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M12 18v-6" />
      <path d="M9 15h6" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  return: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6" />
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
  expense: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M23 11h-6" />
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

export default function DashboardLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const pageTitle = pathname === "/" ? "Dashboard" :
    pathname?.startsWith("/pos") ? "POS System" :
    pathname?.startsWith("/sales") ? "Sales" :
    pathname?.startsWith("/products") ? "Products" :
    pathname?.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";

  return (
    <div className={styles.wrapper}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
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
        <nav className={styles.nav}>
          {SIDEBAR_ITEMS.map((item, i) => {
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
            <Link href="/pos" className={styles.posButton}>POS System</Link>
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
                  {(user?.name?.[0] || "U").toUpperCase()}
                </div>
                <span className={styles.userName}>{user?.name || "User"}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className={styles.userDropdown}>
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
