"use client";

import { useEffect } from "react";
import { getStoredTabletToken, readStoredTabletToken } from "../lib/device-token-storage";

/**
 * If we open /tablet (or connect) without ?token=, send the user to the saved link.
 * Fast path: sync web caches; then async native (Preferences / file) for cold start after full kill.
 */
export default function TabletResumeSync() {
  useEffect(() => {
    const tryRestore = async () => {
      if (typeof window === "undefined") return;
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("token") || sp.get("choose") === "1") return;
      const raw = window.location.pathname || "";
      const path = raw.replace(/\/+$/, "") || "/";
      const tabletish =
        path === "/tablet" ||
        path === "/tablet/connect" ||
        /^\/tablet\/\d+$/.test(path);
      if (!tabletish) return;

      const fast = readStoredTabletToken();
      if (fast) {
        window.location.replace(`${window.location.origin}/tablet?token=${encodeURIComponent(fast)}`);
        return;
      }
      const t = await getStoredTabletToken();
      if (t) {
        window.location.replace(`${window.location.origin}/tablet?token=${encodeURIComponent(t)}`);
      }
    };

    void tryRestore();

    const onVis = () => {
      if (document.visibilityState === "visible") {
        void tryRestore();
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return null;
}
