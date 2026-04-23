import { defaultCache } from "@serwist/next/worker";
import { NetworkFirst, NetworkOnly } from "serwist";
import { ExpirationPlugin } from "serwist";
import { Serwist } from "serwist";

/**
 * Extended offline caching: prepend higher quotas + 7d retention for same-origin
 * API GET, RSC, and HTML so previously used surfaces stay available offline. Rules
 * here run before `defaultCache` (first match wins). Auth stays off-cache.
 * Each origin = separate storage (per-tenant on subdomains).
 */
const SEVEN_DAYS = 7 * 24 * 60 * 60;

const apiBulkExpiration = () => [
  new ExpirationPlugin({
    maxEntries: 500,
    maxAgeSeconds: SEVEN_DAYS,
    maxAgeFrom: "last-used",
  }),
];

const pageBulkExpiration = (maxEntries) => [
  new ExpirationPlugin({
    maxEntries,
    maxAgeSeconds: SEVEN_DAYS,
  }),
];

const extendedOfflineCache = [
  {
    matcher: /\/api\/auth\/.*/i,
    handler: new NetworkOnly({ networkTimeoutSeconds: 10 }),
  },
  {
    matcher: ({ sameOrigin, url: { pathname }, request }) =>
      sameOrigin &&
      request.method === "GET" &&
      pathname.startsWith("/api/") &&
      !pathname.startsWith("/api/auth/"),
    handler: new NetworkFirst({
      cacheName: "api-offline-bulk",
      networkTimeoutSeconds: 30,
      plugins: apiBulkExpiration(),
    }),
  },
  {
    matcher: ({ request, url: { pathname }, sameOrigin }) =>
      request.headers.get("RSC") === "1" &&
      request.headers.get("Next-Router-Prefetch") === "1" &&
      sameOrigin &&
      !pathname.startsWith("/api/"),
    handler: new NetworkFirst({
      cacheName: "pages-rsc-prefetch-bulk",
      plugins: pageBulkExpiration(300),
    }),
  },
  {
    matcher: ({ request, url: { pathname }, sameOrigin }) =>
      request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
    handler: new NetworkFirst({
      cacheName: "pages-rsc-bulk",
      plugins: pageBulkExpiration(300),
    }),
  },
  {
    matcher: ({ request, url: { pathname }, sameOrigin }) =>
      request.headers.get("Content-Type")?.includes("text/html") &&
      sameOrigin &&
      !pathname.startsWith("/api/"),
    handler: new NetworkFirst({
      cacheName: "pages-html-bulk",
      plugins: pageBulkExpiration(300),
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  cacheId: "restaurant-saas",
  runtimeCaching: extendedOfflineCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
