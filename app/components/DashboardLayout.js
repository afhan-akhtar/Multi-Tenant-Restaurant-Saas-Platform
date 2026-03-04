"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

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
  { section: "POS & KITCHEN", items: [
    { href: "/pos", label: "POS System", icon: "pos" },
    { href: "/kds", label: "Kitchen Display (KDS)", icon: "kds" },
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

function NavItem({ href, label, icon, isActive, collapsed, onNavigate, badge }) {
  return (
    <Link
      href={href || "#"}
      onClick={onNavigate}
      className={`flex items-center gap-3 py-2.5 px-4 text-slate-400 no-underline transition-all duration-200 border-l-[3px] border-transparent ml-0 hover:bg-sidebar-hover hover:text-white ${
        isActive ? "bg-primary/15 text-white border-l-primary" : ""
      }`}
    >
      <span className="w-5 h-5 min-w-5 shrink-0 [&>svg]:w-full [&>svg]:h-full relative">
        {ICONS[icon] || ICONS.dashboard}
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className={`whitespace-nowrap text-sm overflow-hidden transition-opacity duration-200 ${collapsed ? "opacity-0 invisible w-0" : ""}`}>
        {label}
      </span>
      {badge != null && badge > 0 && !collapsed && (
        <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold shrink-0">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
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

function withBasePath(basePath, href) {
  if (!basePath) return href;
  const base = basePath.replace(/\/$/, "");
  if (href === "/") return base || "/";
  return `${base}${href}`;
}

export default function DashboardLayout({ children, user, pendingTenantCount = 0, basePath = "" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();
  const isSuperAdmin = user?.type === "super_admin";

  const sidebarItems = isSuperAdmin ? SUPER_ADMIN_ITEMS : RESTAURANT_ITEMS;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobileLayout(mq.matches);
    const handler = () => setIsMobileLayout(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen]);

  const closeSidebarOnNavigate = () => {
    if (isMobileLayout) setSidebarOpen(false);
  };

  const relPath = basePath ? (pathname?.replace(new RegExp(`^${basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), "") || "/") : pathname;
  const normRelPath = (relPath || "/").replace(/\/$/, "") || "/";

  const isActive = (href) => {
    const fullHref = withBasePath(basePath, href);
    if (href === "/") return pathname === fullHref || pathname === `${fullHref}/`;
    return pathname?.startsWith(fullHref);
  };

  const pageTitle = PAGE_TITLES[normRelPath] || normRelPath?.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";

  const displayName = isSuperAdmin
    ? "Super Admin"
    : (user?.name === "Demo Staff" ? "Restaurant Admin" : (user?.name || "User"));

  return (
    <div className="min-h-screen flex bg-color-bg">
      <aside
        className={`fixed top-0 left-0 z-[100] h-screen flex flex-col overflow-hidden shadow-lg text-slate-300 transition-[width,transform] duration-300 ease-out bg-sidebar
          ${sidebarOpen ? "w-[min(260px,85vw)] sm:w-[260px] translate-x-0" : "w-[72px] -translate-x-full lg:translate-x-0"}
        `}
      >
        <div className={`flex items-center justify-between gap-3 p-4 min-h-[56px] shrink-0 ${!sidebarOpen ? "flex-col justify-start py-4 px-2" : ""}`}>
          <button
            className={`shrink-0 p-2 rounded-sm flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer
              ${!sidebarOpen ? "order-1" : "order-2"}
            `}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className={`flex items-center gap-3 min-w-0 ${!sidebarOpen ? "order-2 flex-col" : "order-1"}`}>
            <div className="w-10 h-10 min-w-10 bg-primary text-white rounded-md flex items-center justify-center font-bold text-xl">R</div>
            <span className={`font-semibold text-[1.1rem] whitespace-nowrap ${!sidebarOpen ? "opacity-0 invisible w-0 overflow-hidden" : ""}`}>Restaurant</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {sidebarItems.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="mt-4">
                  <div className={`py-2 px-4 text-[0.7rem] font-semibold uppercase tracking-widest text-slate-500 ${!sidebarOpen ? "opacity-0 invisible w-0 overflow-hidden" : ""}`}>{item.section}</div>
                  {item.items.map((sub) => (
                    <NavItem
                      key={sub.href}
                      href={withBasePath(basePath, sub.href)}
                      label={sub.label}
                      icon={sub.icon}
                      isActive={isActive(sub.href)}
                      collapsed={!sidebarOpen}
                      onNavigate={closeSidebarOnNavigate}
                      badge={sub.href === "/restaurants" ? pendingTenantCount : undefined}
                    />
                  ))}
                </div>
              );
            }
            return (
              <NavItem
                key={item.href}
                href={withBasePath(basePath, item.href)}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.href)}
                collapsed={!sidebarOpen}
                onNavigate={closeSidebarOnNavigate}
              />
            );
          })}
        </nav>
      </aside>

      <div className={`flex-1 min-h-screen flex flex-col transition-[margin] duration-300 ${sidebarOpen ? "lg:ml-[260px]" : "lg:ml-[72px]"} ml-0`}>
        <header className="h-14 sm:h-16 bg-color-card border-b border-color-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-sm gap-2 min-w-0">
          <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              className="flex lg:hidden shrink-0 w-10 h-10 border-0 bg-transparent text-color-text cursor-pointer rounded-md items-center justify-center hover:bg-color-bg [&>svg]:w-6 [&>svg]:h-6"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className="text-base sm:text-xl font-semibold text-color-text m-0 truncate min-w-0">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!isSuperAdmin && (
              <Link href={withBasePath(basePath, "/pos")} className="py-1.5 px-3 sm:py-2 sm:px-4 bg-primary text-white no-underline rounded-md font-medium text-xs sm:text-sm transition-colors hover:bg-primary-hover shrink-0">
                POS
              </Link>
            )}
            <button className="w-10 h-10 border-0 bg-transparent text-color-text-muted cursor-pointer rounded-md flex items-center justify-center hover:bg-color-bg hover:text-color-text transition-colors [&>svg]:w-[22px] [&>svg]:h-[22px]" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 py-1 px-2 bg-transparent border-0 cursor-pointer rounded-md text-color-text hover:bg-color-bg"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-[0.95rem]">
                  {(displayName?.[0] || "U").toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{displayName}</span>
                <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 bg-color-card rounded-md shadow-lg min-w-[180px] py-2 z-[60] border border-color-border">
                  {isSuperAdmin && (
                    <Link href={withBasePath(basePath, "/impersonation")} onClick={() => setUserMenuOpen(false)} className="block w-full py-2.5 px-4 text-left bg-transparent border-0 text-color-text no-underline cursor-pointer text-sm hover:bg-color-bg transition-colors">Impersonate</Link>
                  )}
                  <Link href={withBasePath(basePath, "/profile")} onClick={() => setUserMenuOpen(false)} className="block w-full py-2.5 px-4 text-left bg-transparent border-0 text-color-text no-underline cursor-pointer text-sm hover:bg-color-bg transition-colors">Profile</Link>
                  <Link href={withBasePath(basePath, "/settings")} onClick={() => setUserMenuOpen(false)} className="block w-full py-2.5 px-4 text-left bg-transparent border-0 text-color-text no-underline cursor-pointer text-sm hover:bg-color-bg transition-colors">Settings</Link>
                  <button onClick={() => signOut({ callbackUrl: "/login" })} className="block w-full py-2.5 px-4 text-left bg-transparent border-0 text-color-text no-underline cursor-pointer text-sm hover:bg-color-bg transition-colors">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>

        <footer className="py-3 px-4 sm:py-4 sm:px-6 text-xs text-color-text-muted border-t border-color-border bg-color-card shrink-0">
          Copyright © {new Date().getFullYear()} Multi-Tenant Restaurant SaaS. All Rights Reserved.
        </footer>
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[90]"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
