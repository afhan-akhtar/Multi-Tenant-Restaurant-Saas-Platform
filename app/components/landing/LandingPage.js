"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { DEFAULT_SUBSCRIPTION_PLANS } from "@/lib/subscriptionPlans";
import { formatEur } from "@/lib/currencyFormat";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-landing-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});

/** Single nav target — product map section */
const PRODUCTS_HREF = "#modules";

/**
 * Unsplash URLs verified HTTP 200 (Next image optimizer). Matches restaurant / ops context.
 * Dashboard-aligned copy references: DashboardLayout (tenant + super-admin nav).
 */
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
  { label: "Tenant boundary", value: "Data stays inside each restaurant account" },
  { label: "Single spine", value: "Catalog feeds POS, KDS, and reporting together" },
  { label: "Two consoles", value: "Venue day-to-day + platform oversight when you need it" },
];

/** Bento-style capability grid — reflects real sidebar groupings */
const STACK_TILES = [
  {
    title: "Catalog",
    tag: "Menu engineering",
    body: "Categories, Products, and Add-on Groups—one source for pricing and modifiers before anything hits the floor.",
    span: "md:col-span-2",
  },
  {
    title: "Line & pass",
    tag: "POS & Kitchen",
    body: "POS System, Kitchen Display, and Devices share the same ticket shape your crew is trained on.",
    span: "",
  },
  {
    title: "Room & QR",
    tag: "Floor",
    body: "Tables and Table QR codes keep dine-in orders in the same stream as counter and handheld.",
    span: "",
  },
  {
    title: "Guests & campaigns",
    tag: "CRM",
    body: "Segments, Loyalty, Email Campaigns, and Customers stay scoped to the tenant that owns the relationship.",
    span: "md:col-span-2",
  },
  {
    title: "Numbers & cash",
    tag: "Reporting",
    body: "Dashboard signals extend into Reports, Z-Reports, and Cashbook for audits and shifts.",
    span: "",
  },
  {
    title: "People & plans",
    tag: "Admin",
    body: "Tenant Admins, Roles, My Subscription—plus platform tools for estates and billing when you operate at scale.",
    span: "",
  },
];

const SOLUTIONS_PANEL = {
  title: "Isolation without fragmentation",
  lead:
    "HarborLedger is built so many restaurants can live on one platform without sharing menus, staff lists, or payouts. You ship improvements once; each tenant inherits them on your schedule.",
  bullets: [
    "Restaurant staff see only their venue’s world.",
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

/** Mirrors DashboardLayout groupings (tenant + platform operator). */
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

/** Named groups (marketing) — reviews written for HarborLedger’s multi-tenant model */
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
    a: "Tenants are first-class: each restaurant’s data and roles are walled off, while your team can still roll out updates and observe health across the estate from the platform side.",
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

function SectionLabel({ children, light }) {
  return (
    <p
      className={`${fraunces.className} text-sm font-medium tracking-wide ${light ? "text-teal-300" : "text-teal-700"}`}
    >
      {children}
    </p>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
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
    <div
      className={`${jakarta.className} ${jakarta.variable} ${fraunces.variable} scroll-smooth bg-[#f6f4f0] text-slate-800 antialiased`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[20%] -top-[10%] h-[min(520px,65vh)] w-[min(640px,80vw)] rounded-[50%] bg-gradient-to-br from-teal-200/35 via-cyan-100/20 to-transparent blur-3xl" />
        <div className="absolute -right-[12%] top-[15%] h-[min(420px,50vh)] w-[min(480px,70vw)] rounded-[50%] bg-gradient-to-bl from-amber-200/25 via-orange-100/15 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f4f0_0%,#f0faf8_40%,#f6f4f0_100%)]" />
        <div className="absolute inset-0 opacity-[0.3] [background-image:linear-gradient(to_right,#94a3b810_1px,transparent_1px),linear-gradient(to_bottom,#94a3b810_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      <header
        className={`sticky top-0 z-[100] bg-white/90 backdrop-blur-md backdrop-saturate-150 [isolation:isolate] transition-shadow duration-200 ease-out ${
          navScrolled ? "shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)]" : "shadow-none"
        }`}
      >
        <div className="relative z-[101] mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
          <a href="/" className="flex shrink-0 items-center gap-2.5 transition hover:opacity-90 lg:min-w-[180px]">
            <LogoMark />
            <span className={`${fraunces.className} text-lg font-semibold tracking-tight text-slate-900`}>
              HarborLedger
            </span>
          </a>

          <nav
            className="hidden flex-1 justify-center gap-0.5 lg:flex xl:gap-1"
            aria-label="Primary"
          >
            <a
              href={PRODUCTS_HREF}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-stone-100 xl:px-4"
            >
              Products
            </a>
            <a
              href="#solutions"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-stone-100 xl:px-4"
            >
              Solutions
            </a>
            <a
              href="#pricing"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-stone-100 xl:px-4"
            >
              Pricing
            </a>
            <a
              href="#customers"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-stone-100 xl:px-4"
            >
              Customers
            </a>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-stone-100 lg:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="hidden rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:from-teal-700 hover:to-teal-800 lg:inline-flex"
            >
              Register
            </Link>
            <button
              type="button"
              className="relative z-[102] flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-800 shadow-sm lg:hidden"
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
            className="relative z-[101] max-h-[min(75vh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain border-t border-stone-200 bg-white px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-0.5">
              <a
                href={PRODUCTS_HREF}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-stone-50"
                onClick={closeMobile}
              >
                Products
              </a>
              <a
                href="#solutions"
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-stone-50"
                onClick={closeMobile}
              >
                Solutions
              </a>
              <a
                href="#pricing"
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-stone-50"
                onClick={closeMobile}
              >
                Pricing
              </a>
              <a
                href="#customers"
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-stone-50"
                onClick={closeMobile}
              >
                Customers
              </a>
              <div className="mt-4 border-t border-stone-200 pt-4">
                <Link
                  href="/login"
                  className="block rounded-xl px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-stone-100"
                  onClick={closeMobile}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="mt-2 block rounded-full bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-center text-sm font-semibold text-white shadow-md"
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
        <section className="overflow-hidden border-b border-stone-200/90 bg-gradient-to-b from-white to-[#f0faf7]/80">
          <div className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
            <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="border-l-4 border-teal-500 pl-5 lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">HarborLedger</p>
                <h1
                  className={`${fraunces.className} mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.2rem]`}
                >
                  Run many restaurants on one spine—without blending their books.
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-600">
                  A multi-tenant layer for hospitality: each site keeps its own menu, staff, and reports,
                  while you keep one codebase and one rollout story.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="inline-flex rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:from-teal-700 hover:to-teal-800"
                  >
                    Register
                  </Link>
                  <a
                    href="#stack"
                    className="inline-flex rounded-full border border-stone-300 bg-white/90 px-8 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-400 hover:bg-teal-50/80"
                  >
                    See the stack
                  </a>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  <div className="relative col-span-12 aspect-[5/4] overflow-hidden rounded-2xl shadow-xl shadow-stone-400/25 ring-1 ring-stone-200/80 sm:col-span-8 sm:aspect-[4/3] sm:row-span-2">
                    <Image
                      src={HERO_GRID_FOUR[0].src}
                      alt={HERO_GRID_FOUR[0].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority
                    />
                  </div>
                  <div className="relative col-span-6 aspect-square overflow-hidden rounded-xl ring-1 ring-stone-200/70 sm:col-span-4">
                    <Image
                      src={HERO_GRID_FOUR[1].src}
                      alt={HERO_GRID_FOUR[1].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 200px"
                      priority
                    />
                  </div>
                  <div className="relative col-span-6 aspect-square overflow-hidden rounded-xl ring-1 ring-stone-200/70 sm:col-span-4">
                    <Image
                      src={HERO_GRID_FOUR[2].src}
                      alt={HERO_GRID_FOUR[2].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 200px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-teal-800 to-teal-900 py-10 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {SIGNAL_STRIP.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="text-[11px] font-bold uppercase tracking-widest text-teal-200/90">{s.label}</p>
                <p className={`${fraunces.className} mt-2 text-lg font-medium leading-snug text-white`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="modules" className="scroll-mt-28 border-b border-stone-200/80 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <SectionLabel>Product map</SectionLabel>
              <h2 className={`${fraunces.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                Everything in the app, named the same way
              </h2>
              <p className="mt-4 text-slate-600">
                No parallel vocabulary: what you read here is what you click after login.
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {PRODUCT_MAP_SECTIONS.map((block) => (
                <div
                  key={block.title}
                  className="rounded-2xl border border-stone-200 bg-[#faf9f7] p-6 shadow-sm lg:p-8"
                >
                  <h3 className={`${fraunces.className} text-lg font-semibold text-teal-800`}>{block.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
                    {block.items.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="scroll-mt-28 border-b border-stone-200/80 bg-[#f6f4f0] py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Capability stack</SectionLabel>
              <h2 className={`${fraunces.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                A bento view of how work flows
              </h2>
              <p className="mt-4 text-slate-600">
                Six tiles, six rhythms—from recipe card to ledger—without hopping products.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {STACK_TILES.map((t) => (
                <div
                  key={t.title}
                  className={`flex flex-col rounded-2xl border border-stone-200/90 bg-white p-6 shadow-md shadow-stone-200/40 ${t.span}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">{t.tag}</span>
                  <h3 className={`${fraunces.className} mt-2 text-xl font-semibold text-slate-900`}>{t.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="solutions"
          className="scroll-mt-28 border-b border-stone-200/90 bg-white py-16 lg:py-24"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-stone-200/80">
              <Image
                src={SOLUTIONS_PANEL.image}
                alt={SOLUTIONS_PANEL.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <SectionLabel>Why multi-tenant</SectionLabel>
              <h2 className={`${fraunces.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                {SOLUTIONS_PANEL.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{SOLUTIONS_PANEL.lead}</p>
              <ul className="mt-8 space-y-4">
                {SOLUTIONS_PANEL.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-slate-700">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-teal-500" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-10 inline-flex rounded-full border-2 border-teal-600 px-6 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
              >
                Open a tenant
              </Link>
            </div>
          </div>
        </section>

        <section id="venue" className="scroll-mt-28 bg-stone-100/90 py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-xl">
              <SectionLabel>In the venue</SectionLabel>
              <h2 className={`${fraunces.className} mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl`}>
                Service still happens in rooms, not only in browsers
              </h2>
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
              {GALLERY_STRIPS.map((item) => (
                <article
                  key={item.title}
                  className="w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md sm:w-auto"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 85vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className={`${fraunces.className} font-semibold text-slate-900`}>{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="touchpoints" className="scroll-mt-28 border-y border-stone-200/80 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>Channels</SectionLabel>
                <h2 className={`${fraunces.className} mt-2 text-3xl font-semibold text-slate-900`}>
                  Three surfaces, one order model
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-600">
                Names match the sidebar: POS System, Kitchen Display (KDS), and Floor &amp; Table QR.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {TOUCHPOINT_CARDS.map((item, idx) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50 shadow-sm"
                >
                  <div className="relative aspect-[16/11]">
                    <span className="absolute left-4 top-4 z-10 font-mono text-3xl font-bold text-white/90 drop-shadow">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <h3
                      className={`${fraunces.className} absolute bottom-4 left-4 right-4 text-xl font-semibold text-white`}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="p-5 text-sm leading-relaxed text-slate-600">{item.caption}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="customers"
          className="scroll-mt-28 border-y border-stone-200/90 bg-gradient-to-b from-[#f6f4f0] to-white py-16 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Customers</SectionLabel>
              <h2 className={`${fraunces.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                Groups running live on HarborLedger
              </h2>
              <p className="mt-4 text-slate-600">
                Real operator reviews from multi-site brands—same vocabulary as your dashboards (My Subscription,
                plans, commission).
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-stone-200/80 py-6">
              {TRUSTED_CLIENT_NAMES.map((name) => (
                <span
                  key={name}
                  className={`${fraunces.className} text-sm font-semibold text-slate-500 sm:text-base`}
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CLIENT_TESTIMONIALS.map((c) => (
                <article
                  key={c.company}
                  className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-md shadow-stone-200/50"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-teal-50/80 px-4 py-3">
                    <span className={`${fraunces.className} text-base font-semibold text-teal-900`}>
                      {c.company}
                    </span>
                    <span className="text-right text-xs text-slate-500">{c.footprint}</span>
                  </div>
                  <div className="relative aspect-[5/3] w-full shrink-0">
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className={`${fraunces.className} text-base leading-relaxed text-slate-800`}>
                      &ldquo;{c.quote}&rdquo;
                    </p>
                    <div className="mt-4 border-t border-stone-100 pt-4">
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-28 border-y border-stone-200/90 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className={`${fraunces.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                Same plans as Subscriptions &amp; Plans
              </h2>
              <p className="mt-4 text-slate-600">
                Figures below match the default catalog seeded for platform admins and shown to each restaurant under{" "}
                <strong className="font-semibold text-slate-800">My Subscription</strong>. Your live tenant may differ
                if plans were edited in the dashboard.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
              {DEFAULT_SUBSCRIPTION_PLANS.map((plan) => {
                const isHighlight = plan.code === "premium";
                return (
                  <div
                    key={plan.code}
                    className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition ${
                      isHighlight
                        ? "border-teal-500 bg-gradient-to-b from-teal-50/90 to-white shadow-lg shadow-teal-600/10 ring-2 ring-teal-500/30 lg:scale-[1.02] lg:z-10"
                        : "border-stone-200 bg-[#faf9f7]"
                    }`}
                  >
                    {isHighlight ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        Popular
                      </span>
                    ) : null}
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{plan.code}</p>
                    <h3 className={`${fraunces.className} mt-1 text-xl font-semibold text-slate-900`}>{plan.name}</h3>
                    {plan.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.description}</p>
                    ) : null}
                    <div className="mt-5">
                      <span className="text-3xl font-bold text-slate-900">{formatEur(plan.monthlyPrice)}</span>
                      <span className="text-sm font-normal text-slate-500">/month</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {plan.commissionPercent}% commission · {plan.trialDays} day trial · {plan.graceDays} day grace
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(plan.features?.items || []).map((feature) => (
                        <span
                          key={`${plan.code}-${feature}`}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-stone-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/register"
                      className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                        isHighlight
                          ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/20 hover:from-teal-700 hover:to-teal-800"
                          : "border-2 border-stone-300 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50/80"
                      }`}
                    >
                      Get started
                    </Link>
                  </div>
                );
              })}
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500">
              Assignments and upgrades are handled like in the app: restaurants request changes; platform teams manage
              plans under Subscriptions &amp; Plans.
            </p>
          </div>
        </section>

        {/* FAQ — native <details> so expand/collapse works without JS quirks */}
        <section id="faq" className="relative z-20 scroll-mt-28 bg-slate-950 py-16 lg:py-20">
          <div className="pointer-events-auto mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className={`${fraunces.className} text-center text-2xl font-semibold text-white sm:text-3xl`}>
              Questions
            </h2>
            <p className="mt-3 text-center text-sm text-slate-400">Straight answers—no jargon wall.</p>
            <div className="mt-10 space-y-2">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  name="hl-landing-faq"
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm open:border-teal-500/25 open:bg-white/[0.07] [&[open]_summary_.faq-chevron]:rotate-180 [&[open]_summary_.faq-chevron]:bg-teal-500/30 [&[open]_summary_.faq-chevron]:text-teal-100"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition marker:content-none hover:bg-white/5 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1">{item.q}</span>
                    <span
                      className="faq-chevron flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-transform duration-200"
                      aria-hidden
                    >
                      ▼
                    </span>
                  </summary>
                  <div className="border-t border-white/10 px-5 pb-4">
                    <p className="pt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-teal-400/30 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-900 py-20 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-20%,rgba(255,255,255,0.2),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className={`${fraunces.className} text-3xl font-semibold text-white sm:text-4xl`}>
              Ready to run every venue on one stack?
            </h2>
            <p className="mt-4 text-lg text-teal-50/95">
              Register to start tenant setup—or sign in if you are already live.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-teal-900 shadow-xl transition hover:bg-teal-50"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="inline-flex rounded-full border-2 border-white/50 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-stone-200 bg-stone-100/95">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className={`${fraunces.className} text-lg font-semibold text-slate-900`}>
                  HarborLedger
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-slate-600">
                Multi-tenant operations for restaurant groups that outgrow single-site tools.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Explore</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>
                    <a href="#modules" className="hover:text-teal-700">
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="#solutions" className="hover:text-teal-700">
                      Solutions
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-teal-700">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#customers" className="hover:text-teal-700">
                      Customers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Account</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>
                    <Link href="/login" className="hover:text-teal-700">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-teal-700">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-500">
                  <li>Privacy &amp; terms (placeholder)</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-12 border-t border-stone-200 pt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} HarborLedger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
