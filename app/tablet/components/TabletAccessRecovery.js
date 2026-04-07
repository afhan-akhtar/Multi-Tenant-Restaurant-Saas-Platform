"use client";

import { useEffect, useState } from "react";
import {
  clearStoredTabletToken,
  getStoredTabletToken,
  persistTabletLaunch,
  restoreTabletTokenWithGracePasses,
} from "../lib/device-token-storage";

/**
 * Token-only tablet entry. Device token is globally unique; restaurant id is not required in the URL.
 * Saved token is restored from localStorage (web) and Capacitor Preferences (iOS/Android) until the device
 * is disabled or the admin regenerates the link.
 */
export default function TabletAccessRecovery({ initialToken = "", invalid = false }) {
  /** Never pre-fill invalid tokens as readable text; successful opens persist storage instead. */
  const [token, setToken] = useState(() => (invalid ? "" : initialToken));
  const [error, setError] = useState("");
  const [bootPhase, setBootPhase] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (invalid && initialToken) {
        try {
          const s = await getStoredTabletToken();
          if (cancelled) return;
          // Bad link in URL but device still has another saved token → go straight to it (no form).
          if (s && s !== String(initialToken).trim()) {
            await persistTabletLaunch(s);
            window.location.href = `${window.location.origin}/tablet?token=${encodeURIComponent(s)}`;
            return;
          }
          if (s && s === String(initialToken).trim()) {
            await clearStoredTabletToken();
          }
        } catch {
          /* ignore */
        }
        if (!cancelled) setBootPhase("ready");
        return;
      }
      if (invalid) {
        if (!cancelled) setBootPhase("ready");
        return;
      }
      if (initialToken) {
        if (!cancelled) setBootPhase("ready");
        return;
      }
      const t = await restoreTabletTokenWithGracePasses();
      if (cancelled) return;
      if (t) {
        await persistTabletLaunch(t);
        window.location.href = `${window.location.origin}/tablet?token=${encodeURIComponent(t)}`;
        return;
      }
      if (!cancelled) setBootPhase("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [invalid, initialToken]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const t = String(token).trim();
    if (!t) {
      setError("Paste the device token from Admin → Devices (TABLET).");
      return;
    }
    await persistTabletLaunch(t);
    window.location.href = `/tablet?token=${encodeURIComponent(t)}`;
  };

  if (bootPhase === "loading") {
    return (
      <div className="min-h-dvh-safe flex items-center justify-center bg-slate-950 px-4 py-10 pb-nav-safe text-white">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-slate-200">Restoring tablet…</p>
          <p className="text-sm text-slate-500">Loading saved device link (first open may take a few seconds)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh-safe flex items-center justify-center bg-slate-950 px-4 py-10 pb-nav-safe text-white">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Tablet access</h1>
          <p className="mt-2 text-sm text-slate-400">
            {invalid
              ? "This token is invalid or the TABLET device isn’t active. Paste the new token from Admin → Devices."
              : "Paste the device token from Admin → Devices (TABLET). No restaurant ID needed."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="recovery-token" className="block text-xs font-medium text-slate-500">
              Device token
            </label>
            <input
              id="recovery-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter device token"
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-3 font-mono text-sm text-white placeholder:text-slate-600"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-500"
          >
            Open tablet
          </button>
        </form>

        <p className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
          The token identifies your restaurant automatically. Get it from{" "}
          <span className="text-slate-400 font-medium">Admin → Devices</span> → TABLET.
        </p>
      </div>
    </div>
  );
}
