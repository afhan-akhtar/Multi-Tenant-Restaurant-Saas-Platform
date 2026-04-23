"use client";

import { SerwistProvider } from "@serwist/next/react";

/**
 * Registers the app service worker in production so shell, RSC, and static
 * assets can be cached per-origin (tenant-safe). In development it is off unless
 * NEXT_PUBLIC_ENABLE_PWA_IN_DEV=1 (set in .env.local) so you can test the PWA.
 */
const disableSw =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_PWA_IN_DEV !== "1";

export function SerwistProviderClient({ children }) {
  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={disableSw}
      cacheOnNavigation
      reloadOnOnline={false}
    >
      {children}
    </SerwistProvider>
  );
}
