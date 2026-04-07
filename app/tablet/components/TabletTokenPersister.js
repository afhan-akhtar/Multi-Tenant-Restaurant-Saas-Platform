"use client";

import { useEffect, useLayoutEffect } from "react";
import { persistTabletLaunch } from "../lib/device-token-storage";

/**
 * Persists device token as early as possible after hydration (before useEffect in children).
 * Helps Capacitor cold starts: next launch can read Preferences even if the server URL has no ?token=.
 * Periodic refresh keeps native layers aligned so full app restarts rarely need re-entry.
 */
export default function TabletTokenPersister({ token }) {
  useLayoutEffect(() => {
    if (token) {
      void persistTabletLaunch(token);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => {
      void persistTabletLaunch(token);
    }, 8 * 60 * 1000);
    return () => clearInterval(id);
  }, [token]);

  return null;
}
