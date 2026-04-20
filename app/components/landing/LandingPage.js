"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import { DEFAULT_SUBSCRIPTION_PLANS } from "@/lib/subscriptionPlans";
import { formatEur } from "@/lib/currencyFormat";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/** Single nav target — product map section */
const PRODUCTS_HREF = "#modules";

const HERO_GRID_FOUR = [
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    alt: "Staff using a tablet at a restaurant counter",
  },
  {
    src: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80",
    alt: "Chef plating food in a professional kitchen",
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
    alt: "Bright café interior with counter service",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    alt: "Wine and plated courses on a restaurant table",
  },
];

const SIGNAL_STRIP = [
  { label: "Tenant boundary", value: "Data stays inside each restaurant account", icon: "🔒" },
  { label: "Single spine", value: "Catalog feeds POS, KDS, and reporting together", icon: "⚡" },
  { label: "Two consoles", value: "Venue day-to-day + platform oversight when you need it", icon: "🖥️" },
];

const STACK_TILES = [
  {
    title: "Catalog",
    tag: "Menu engineering",
    body: "Categories, Products, and Add-on Groups—one source for pricing and modifiers before anything hits the floor.",
    span: "md:col-span-2",
    icon: "📋",
  },
  {
    title: "Line & pass",
    tag: "POS & Kitchen",
    body: "POS System, Kitchen Display, and Devices share the same ticket shape your crew is trained on.",
    span: "",
    icon: "🍽️",
  },
  {
    title: "Room & QR",
    tag: "Floor",
    body: "Tables and Table QR codes keep dine-in orders in the same stream as counter and handheld.",
    span: "",
    icon: "📱",
  },
  {
    title: "Guests & campaigns",
    tag: "CRM",
    body: "Segments, Loyalty, Email Campaigns, and Customers stay scoped to the tenant that owns the relationship.",
    span: "md:col-span-2",
    icon: "💌",
  },
  {
    title: "Numbers & cash",
    tag: "Reporting",
    body: "Dashboard signals extend into Reports, Z-Reports, and Cashbook for audits and shifts.",
    span: "",
    icon: "📊",
  },
  {
    title: "People & plans",
    tag: "Admin",
    body: "Tenant Admins, Roles, My Subscription—plus platform tools for estates and billing when you operate at scale.",
    span: "",
    icon: "👥",
  },
];

const SOLUTIONS_PANEL = {
  title: "Isolation without fragmentation",
  lead: "HarborLedger is built so many restaurants can live on one platform without sharing menus, staff lists, or payouts. You ship improvements once; each tenant inherits them on your schedule.",
  bullets: [
    "Restaurant staff see only their venue's world.",
    "Platform operators get subscriptions, commission, and cross-tenant visibility where policy allows.",
    "The same feature set—menu through reporting—applies everywhere; you are not maintaining forks per brand.",
  ],
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
  imageAlt: "Analytics and planning on a laptop",
};

const TOUCHPOINT_CARDS = [
  {
    title: "POS System",
    caption: "Checkout flows tied to your catalog and table state.",
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80",
    alt: "Point of sale terminal on a wood counter",
  },
  {
    title: "Kitchen Display (KDS)",
    caption: "Tickets grouped for the line—aligned with POS and QR orders.",
    src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    alt: "Kitchen preparation and plating",
  },
  {
    title: "Floor & Table QR",
    caption: "Tables and QR codes for guest ordering into the same order stream.",
    src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80",
    alt: "Guests dining together at a restaurant",
  },
];

const GALLERY_STRIPS = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    alt: "Busy restaurant dining room",
    title: "Full service",
    caption: "Service pacing your dashboard already measures as revenue and orders.",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
    alt: "Warm modern restaurant interior",
    title: "Every shift",
    caption: "From open to close—same tenant, same menu engine.",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
    alt: "Wood-fired pizza fresh from the oven",
    title: "Kitchen craft",
    caption: "What KDS sees is what the pass cooks.",
  },
];

const PRODUCT_MAP_SECTIONS = [
  {
    title: "Restaurant (per tenant)",
    items: [
      "Dashboard — revenue, tax, sales, customers, pending orders",
      "Menu: Categories · Products · Add-on Groups",
      "POS & Kitchen: POS System · Kitchen Display (KDS) · Devices",
      "Tenant Admins & Security: Users · Roles & Permissions",
      "Floor: Tables · Table QR codes",
      "Billing: My Subscription",
      "Reporting: Reports · Z-Reports · Cashbook",
      "Marketing (CRM): Segments · Loyalty · Email Campaigns · Customers",
      "Settings",
    ],
  },
  {
    title: "Platform (super admin)",
    items: [
      "Restaurant Management",
      "Subscriptions & Plans",
      "Commission & Billing",
      "Global Logs · Impersonation",
      "Settings",
    ],
  },
];

const TRUSTED_CLIENT_NAMES = [
  "Northline Eats",
  "Copper Table Co.",
  "Harborline Group",
  "Urban Grain",
  "Relay Kitchens",
];

const CLIENT_TESTIMONIALS = [
  {
    company: "Northline Eats",
    footprint: "14 locations · EU",
    quote:
      "Every site runs its own menu and staff, but finance finally sees one subscription story. My Subscription matches what ops sees in the dining room.",
    name: "Elena Vásquez",
    role: "Group COO",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    alt: "Portrait of Elena Vásquez",
  },
  {
    company: "Copper Table Co.",
    footprint: "6 brasseries",
    quote:
      "We rolled Premium with KDS and split payments without a second vendor. Commission and trial days are visible the same way they are in the admin console.",
    name: "Marcus Chen",
    role: "IT Director",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    alt: "Portrait of Marcus Chen",
  },
  {
    company: "Harborline Group",
    footprint: "Franchise network",
    quote:
      "Franchisees get their tenant wall—no cross-visibility into sibling brands. Platform billing still rolls up for us under Subscriptions & Plans.",
    name: "Priya Nair",
    role: "VP Operations",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    alt: "Portrait of Priya Nair",
  },
  {
    company: "Urban Grain",
    footprint: "Fast-casual · 9 cities",
    quote:
      "Basic was enough to standardize POS and cashbook across pop-ups; we upgraded to Premium when we added loyalty—same stack, new features toggled on.",
    name: "Jonas Weber",
    role: "Head of Finance",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    alt: "Portrait of Jonas Weber",
  },
  {
    company: "Relay Kitchens",
    footprint: "Delivery-first · 22 kitchens",
    quote:
      "Enterprise unlocked multi-branch reporting and campaign tools without a separate CRM. One ledger for commission—we stopped reconciling three gateways.",
    name: "Amira Okonkwo",
    role: "Chief Commercial Officer",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    alt: "Portrait of Amira Okonkwo",
  },
];

const faqItems = [
  {
    q: "Who is HarborLedger for?",
    a: "Groups that run more than one restaurant brand or location and want one operational stack—menu, service, kitchen, CRM, and reporting—without duplicating systems per site.",
  },
  {
    q: "How is this different from a single-restaurant POS?",
    a: "Tenants are first-class: each restaurant's data and roles are walled off, while your team can still roll out updates and observe health across the estate from the platform side.",
  },
  {
    q: "Do we lose flexibility per venue?",
    a: "No—menus, devices, and campaigns are configured per tenant. Shared DNA, not shared databases.",
  },
  {
    q: "Where do we manage billing?",
    a: "Restaurants use My Subscription in-app; platform teams use Subscriptions & Plans and Commission & Billing—aligned with how the product is already structured.",
  },
];

/* ─── Intersection Observer hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ─── Reveal animation wrapper ─── */
function Reveal({ children, className = "", delay = 0, from = "bottom" }) {
  const [ref, inView] = useInView();

  const transitions = {
    bottom: inView
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-10",
    left: inView
      ? "opacity-100 translate-x-0"
      : "opacity-0 -translate-x-10",
    right: inView
      ? "opacity-100 translate-x-0"
      : "opacity-0 translate-x-10",
    scale: inView
      ? "opacity-100 scale-100"
      : "opacity-0 scale-95",
    fade: inView ? "opacity-100" : "opacity-0",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${transitions[from]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Logo ─── */
function LogoMark() {
  return (
    <svg
      className="h-9 w-9 shrink-0 text-teal-600"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 32V8h6l6 10 6-10h6v24h-6V18l-6 10-6-10v14H8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Section label pill ─── */
function SectionLabel({ children, light }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ring-1 ${
        light
          ? "bg-teal-500/20 text-teal-200 ring-teal-400/30"
          : "bg-teal-50 text-teal-700 ring-teal-200/60"
      }`}
    >
      {children}
    </span>
  );
}

/* ─── Main component ─── */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {}
    try {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    } catch {}
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    function onScroll() {
      setNavScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${poppins.variable} font-poppins scroll-smooth bg-[#f6f4f0] text-slate-800 antialiased`}>

      {/* ── Animated background orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="animate-float absolute -left-[20%] -top-[10%] h-[min(540px,68vh)] w-[min(660px,82vw)] rounded-[50%] bg-gradient-to-br from-teal-200/40 via-cyan-100/25 to-transparent blur-3xl" />
        <div className="animate-float-delayed absolute -right-[12%] top-[15%] h-[min(440px,55vh)] w-[min(500px,72vw)] rounded-[50%] bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent blur-3xl" />
        <div className="animate-float-slow absolute bottom-[10%] left-[30%] h-[min(300px,40vh)] w-[min(380px,55vw)] rounded-[50%] bg-gradient-to-tr from-emerald-100/30 via-teal-50/20 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f4f0_0%,#f0faf8_40%,#f6f4f0_100%)]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,#94a3b810_1px,transparent_1px),linear-gradient(to_bottom,#94a3b810_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-[100] bg-white/90 backdrop-blur-md backdrop-saturate-150 [isolation:isolate] transition-all duration-300 ease-out ${
          navScrolled
            ? "shadow-[0_4px_28px_-8px_rgba(15,23,42,0.14)]"
            : "shadow-none"
        }`}
      >
        <div className="relative z-[101] mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
          <a href="/" className="flex shrink-0 items-center gap-2.5 transition-all duration-200 hover:opacity-85 lg:min-w-[180px]">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight text-slate-900">
              HarborLedger
            </span>
          </a>

          <nav className="hidden flex-1 justify-center gap-0.5 lg:flex xl:gap-1" aria-label="Primary">
            {[
              { href: PRODUCTS_HREF, label: "Products" },
              { href: "#solutions", label: "Solutions" },
              { href: "#pricing", label: "Pricing" },
              { href: "#customers", label: "Customers" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-teal-50 hover:text-teal-700 xl:px-4"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-stone-100 lg:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="hidden rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all duration-200 hover:from-teal-500 hover:to-teal-600 hover:shadow-lg hover:shadow-teal-500/30 lg:inline-flex"
            >
              Register
            </Link>
            <button
              type="button"
              className="relative z-[102] flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 lg:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setMobileOpen((o) => !o);
              }}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id="mobile-nav"
            className="relative z-[101] max-h-[min(75vh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain border-t border-stone-200 bg-white/98 px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {[
                { href: PRODUCTS_HREF, label: "Products" },
                { href: "#solutions", label: "Solutions" },
                { href: "#pricing", label: "Pricing" },
                { href: "#customers", label: "Customers" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-teal-50 hover:text-teal-700"
                  onClick={closeMobile}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 border-t border-stone-200 pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block rounded-xl px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-stone-100"
                  onClick={closeMobile}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block rounded-full bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:from-teal-500 hover:to-teal-600"
                  onClick={closeMobile}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section className="overflow-hidden border-b border-stone-200/90 bg-gradient-to-b from-white to-[#f0faf7]/80">
          <div className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-28">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">

              {/* Hero copy */}
              <div className="lg:col-span-5">
                {/* Animated badge */}
                <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-700 shadow-sm animate-badge-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Multi-tenant restaurant platform
                </div>

                <div
                  className="animate-fade-up border-l-4 border-teal-500 pl-5"
                  style={{ animationDelay: "100ms" }}
                >
                  <h1 className="mt-1 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.1rem]">
                    <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                      Run many restaurants
                    </span>{" "}
                    <span className="text-slate-900">
                      on one spine—without blending their books.
                    </span>
                  </h1>
                  <p
                    className="mt-6 text-lg font-light leading-relaxed text-slate-600"
                    style={{ animationDelay: "200ms" }}
                  >
                    A multi-tenant layer for hospitality: each site keeps its own menu, staff, and reports,
                    while you keep one codebase and one rollout story.
                  </p>
                </div>

                <div
                  className="animate-fade-up mt-10 flex flex-wrap gap-4"
                  style={{ animationDelay: "300ms" }}
                >
                  <Link
                    href="/register"
                    className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5 hover:from-teal-500 hover:to-teal-600"
                  >
                    <span className="relative z-10">Register free</span>
                  </Link>
                  <a
                    href="#stack"
                    className="inline-flex rounded-full border border-stone-300 bg-white/90 px-8 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/80 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    See the stack →
                  </a>
                </div>

                {/* Social proof mini-strip */}
                <div
                  className="animate-fade-up mt-10 flex items-center gap-3"
                  style={{ animationDelay: "400ms" }}
                >
                  <div className="flex -space-x-2">
                    {CLIENT_TESTIMONIALS.slice(0, 4).map((c) => (
                      <div key={c.name} className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
                        <Image src={c.src} alt={c.alt} fill className="object-cover" sizes="32px" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Trusted by <span className="font-semibold text-slate-700">5+ restaurant groups</span>
                  </p>
                </div>
              </div>

              {/* Hero image grid */}
              <div className="lg:col-span-7">
                <Reveal from="right" delay={200}>
                  <div className="grid grid-cols-12 gap-3 sm:gap-4">
                    <div className="relative col-span-12 aspect-[5/4] overflow-hidden rounded-2xl shadow-2xl shadow-stone-400/30 ring-1 ring-stone-200/80 sm:col-span-8 sm:aspect-[4/3] sm:row-span-2 group">
                      <Image
                        src={HERO_GRID_FOUR[0].src}
                        alt={HERO_GRID_FOUR[0].alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="relative col-span-6 aspect-square overflow-hidden rounded-xl ring-1 ring-stone-200/70 sm:col-span-4 group">
                      <Image
                        src={HERO_GRID_FOUR[1].src}
                        alt={HERO_GRID_FOUR[1].alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 50vw, 200px"
                        priority
                      />
                    </div>
                    <div className="relative col-span-6 aspect-square overflow-hidden rounded-xl ring-1 ring-stone-200/70 sm:col-span-4 group">
                      <Image
                        src={HERO_GRID_FOUR[2].src}
                        alt={HERO_GRID_FOUR[2].alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 50vw, 200px"
                      />
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* ── Signal strip ── */}
        <section className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-teal-800 to-teal-900 py-12 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-30%,rgba(255,255,255,0.08),transparent)]" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {SIGNAL_STRIP.map((s, i) => (
              <Reveal key={s.label} from="bottom" delay={i * 100}>
                <div className="group flex items-start gap-4 text-left">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl ring-1 ring-white/15 transition group-hover:bg-teal-500/30">
                    {s.icon}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-teal-200/90">{s.label}</p>
                    <p className="mt-1.5 text-base font-semibold leading-snug text-white">{s.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Product map ── */}
        <section id="modules" className="scroll-mt-28 border-b border-stone-200/80 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="max-w-2xl">
                <SectionLabel>Product map</SectionLabel>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Everything in the app, named the same way
                </h2>
                <p className="mt-4 text-slate-500">
                  No parallel vocabulary: what you read here is what you click after login.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {PRODUCT_MAP_SECTIONS.map((block, i) => (
                <Reveal key={block.title} from="bottom" delay={i * 120}>
                  <div className="group h-full rounded-2xl border border-stone-200 bg-[#faf9f7] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/50 lg:p-8">
                    <h3 className="text-lg font-bold text-teal-800">{block.title}</h3>
                    <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
                      {block.items.map((line) => (
                        <li key={line} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Capability stack (bento) ── */}
        <section id="stack" className="scroll-mt-28 border-b border-stone-200/80 bg-[#f6f4f0] py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="mx-auto max-w-2xl text-center">
                <SectionLabel>Capability stack</SectionLabel>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  A bento view of how work flows
                </h2>
                <p className="mt-4 text-slate-500">
                  Six tiles, six rhythms—from recipe card to ledger—without hopping products.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {STACK_TILES.map((t, i) => (
                <Reveal key={t.title} from="bottom" delay={i * 80} className={t.span}>
                  <div className="group flex h-full flex-col rounded-2xl border border-stone-200/90 bg-white p-6 shadow-md shadow-stone-200/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-teal-600">{t.tag}</span>
                      <span className="text-2xl">{t.icon}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{t.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{t.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Solutions ── */}
        <section id="solutions" className="scroll-mt-28 border-b border-stone-200/90 bg-white py-16 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <Reveal from="left" delay={0}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-stone-200/80 group">
                <Image
                  src={SOLUTIONS_PANEL.image}
                  alt={SOLUTIONS_PANEL.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 to-transparent" />
              </div>
            </Reveal>
            <Reveal from="right" delay={100}>
              <div>
                <SectionLabel>Why multi-tenant</SectionLabel>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {SOLUTIONS_PANEL.title}
                </h2>
                <p className="mt-4 text-lg font-light leading-relaxed text-slate-600">{SOLUTIONS_PANEL.lead}</p>
                <ul className="mt-8 space-y-4">
                  {SOLUTIONS_PANEL.bullets.map((b, i) => (
                    <li key={b} className="flex gap-3 text-slate-700">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-10 inline-flex rounded-full border-2 border-teal-600 px-6 py-2.5 text-sm font-bold text-teal-700 transition-all duration-200 hover:bg-teal-600 hover:text-white"
                >
                  Open a tenant
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── In the venue gallery ── */}
        <section id="venue" className="scroll-mt-28 bg-stone-100/90 py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="mb-10 max-w-xl">
                <SectionLabel>In the venue</SectionLabel>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Service still happens in rooms, not only in browsers
                </h2>
              </div>
            </Reveal>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
              {GALLERY_STRIPS.map((item, i) => (
                <Reveal key={item.title} from="bottom" delay={i * 100} className="w-[85vw] shrink-0 snap-center sm:w-auto">
                  <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 85vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.caption}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Touchpoints (channels) ── */}
        <section id="touchpoints" className="scroll-mt-28 border-y border-stone-200/80 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <SectionLabel>Channels</SectionLabel>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    Three surfaces, one order model
                  </h2>
                </div>
                <p className="max-w-md text-sm text-slate-500">
                  Names match the sidebar: POS System, Kitchen Display (KDS), and Floor &amp; Table QR.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {TOUCHPOINT_CARDS.map((item, idx) => (
                <Reveal key={item.title} from="bottom" delay={idx * 120}>
                  <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-200/70">
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <span className="absolute left-4 top-4 z-10 font-mono text-3xl font-bold text-white/90 drop-shadow-lg">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <Image src={item.src} alt={item.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="p-5 text-sm leading-relaxed text-slate-500">{item.caption}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Customers / testimonials ── */}
        <section
          id="customers"
          className="scroll-mt-28 border-y border-stone-200/90 bg-gradient-to-b from-[#f6f4f0] to-white py-16 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="mx-auto max-w-2xl text-center">
                <SectionLabel>Customers</SectionLabel>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Groups running live on HarborLedger
                </h2>
                <p className="mt-4 text-slate-500">
                  Real operator reviews from multi-site brands—same vocabulary as your dashboards.
                </p>
              </div>
            </Reveal>

            <Reveal from="bottom" delay={100}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-stone-200/80 py-6">
                {TRUSTED_CLIENT_NAMES.map((name) => (
                  <span key={name} className="text-sm font-bold text-slate-400 transition hover:text-teal-600 sm:text-base">
                    {name}
                  </span>
                ))}
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CLIENT_TESTIMONIALS.map((c, i) => (
                <Reveal key={c.company} from="bottom" delay={i * 80}>
                  <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-md shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-200/60">
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-teal-50/80 px-4 py-3">
                      <span className="text-base font-bold text-teal-900">{c.company}</span>
                      <span className="text-right text-xs text-slate-500">{c.footprint}</span>
                    </div>
                    <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden">
                      <Image
                        src={c.src}
                        alt={c.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-base font-light leading-relaxed text-slate-700">
                        &ldquo;{c.quote}&rdquo;
                      </p>
                      <div className="mt-4 border-t border-stone-100 pt-4">
                        <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.role}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="scroll-mt-28 border-y border-stone-200/90 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="mx-auto max-w-2xl text-center">
                <SectionLabel>Pricing</SectionLabel>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Same plans as Subscriptions &amp; Plans
                </h2>
                <p className="mt-4 text-slate-500">
                  Figures below match the default catalog seeded for platform admins and shown to each restaurant under{" "}
                  <strong className="font-semibold text-slate-800">My Subscription</strong>.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
              {DEFAULT_SUBSCRIPTION_PLANS.map((plan, i) => {
                const isHighlight = plan.code === "premium";
                return (
                  <Reveal key={plan.code} from="bottom" delay={i * 100}>
                    <div
                      className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 ${
                        isHighlight
                          ? "border-teal-500 bg-gradient-to-b from-teal-50/90 to-white shadow-xl shadow-teal-600/15 ring-2 ring-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/25 lg:scale-[1.02] lg:z-10"
                          : "border-stone-200 bg-[#faf9f7] shadow-sm hover:shadow-lg hover:border-stone-300"
                      }`}
                    >
                      {isHighlight ? (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                          Most Popular
                        </span>
                      ) : null}
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{plan.code}</p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-900">{plan.name}</h3>
                      {plan.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{plan.description}</p>
                      ) : null}
                      <div className="mt-5">
                        <span className="text-4xl font-extrabold text-slate-900">{formatEur(plan.monthlyPrice)}</span>
                        <span className="text-sm font-normal text-slate-400">/month</span>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        {plan.commissionPercent}% commission · {plan.trialDays} day trial · {plan.graceDays} day grace
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(plan.features?.items || []).map((feature) => (
                          <span
                            key={`${plan.code}-${feature}`}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-stone-200 transition hover:ring-teal-300"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Link
                        href="/register"
                        className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 ${
                          isHighlight
                            ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/20 hover:from-teal-500 hover:to-teal-600 hover:shadow-lg hover:shadow-teal-500/30"
                            : "border-2 border-stone-300 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
                        }`}
                      >
                        Get started
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal from="fade" delay={200}>
              <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-400">
                Assignments and upgrades are handled like in the app: restaurants request changes; platform teams manage
                plans under Subscriptions &amp; Plans.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="relative z-20 scroll-mt-28 bg-slate-950 py-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(20,184,166,0.12),transparent)]" aria-hidden />
          <div className="pointer-events-auto relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Reveal from="bottom">
              <div className="text-center">
                <SectionLabel light>FAQ</SectionLabel>
                <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  Questions &amp; Answers
                </h2>
                <p className="mt-3 text-sm text-slate-400">Straight answers—no jargon wall.</p>
              </div>
            </Reveal>
            <div className="mt-10 space-y-2">
              {faqItems.map((item, i) => (
                <Reveal key={item.q} from="bottom" delay={i * 70}>
                  <details
                    name="hl-landing-faq"
                    className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 open:border-teal-500/30 open:bg-white/[0.08] [&[open]_summary_.faq-chevron]:rotate-180 [&[open]_summary_.faq-chevron]:bg-teal-500/30 [&[open]_summary_.faq-chevron]:text-teal-200"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-white/5 [&::-webkit-details-marker]:hidden marker:content-none">
                      <span className="min-w-0 flex-1">{item.q}</span>
                      <span
                        className="faq-chevron flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-all duration-300"
                        aria-hidden
                      >
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="border-t border-white/10 px-5 pb-4">
                      <p className="pt-3 text-sm font-light leading-relaxed text-slate-400">{item.a}</p>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden border-t border-teal-400/30 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-900 py-20 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-20%,rgba(255,255,255,0.18),transparent)]"
            aria-hidden
          />
          {/* Decorative rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
            <div className="h-[600px] w-[600px] animate-spin-slow rounded-full border border-white/5" />
            <div className="absolute h-[400px] w-[400px] rounded-full border border-white/5" />
          </div>
          <Reveal from="bottom">
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-teal-100 ring-1 ring-white/20 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
                Ready to launch?
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl sm:leading-tight">
                Ready to run every venue on one stack?
              </h2>
              <p className="mt-5 text-lg font-light text-teal-50/90">
                Register to start tenant setup—or sign in if you are already live.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-bold text-teal-900 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-2xl"
                >
                  Register free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:border-white/70 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-stone-200 bg-stone-100/95">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className="text-lg font-bold text-slate-900">HarborLedger</span>
              </div>
              <p className="mt-4 max-w-xs text-sm font-light text-slate-500">
                Multi-tenant operations for restaurant groups that outgrow single-site tools.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Explore</p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-slate-500">
                  {[
                    { href: "#modules", label: "Products" },
                    { href: "#solutions", label: "Solutions" },
                    { href: "#pricing", label: "Pricing" },
                    { href: "#customers", label: "Customers" },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="transition hover:text-teal-700">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Account</p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-slate-500">
                  <li>
                    <Link href="/login" className="transition hover:text-teal-700">Sign in</Link>
                  </li>
                  <li>
                    <Link href="/register" className="transition hover:text-teal-700">Register</Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-400">
                  <li>Privacy &amp; terms (placeholder)</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-12 border-t border-stone-200 pt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} HarborLedger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
