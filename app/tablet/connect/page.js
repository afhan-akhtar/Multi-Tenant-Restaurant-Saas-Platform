"use client";

import { useEffect, useState } from "react";
import {
  getStoredTabletLaunchUrl,
  persistTabletLaunch,
  persistTabletLaunchUrl,
  restoreTabletTokenWithGracePasses,
} from "../lib/device-token-storage";

/**
 * Landing for Capacitor (Android + iOS): paste full URL or device token only.
 * Canonical tablet URL is /tablet?token=… (no restaurant id in path).
 */
export default function TabletConnectPage() {
  const [mode, setMode] = useState("url"); // "url" | "token"
  const [url, setUrl] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [autoRedirectDone, setAutoRedirectDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      if (new URLSearchParams(window.location.search).get("choose") === "1") {
        if (!cancelled) setAutoRedirectDone(true);
        return;
      }
      const tok = await restoreTabletTokenWithGracePasses();
      if (cancelled) return;
      if (tok) {
        await persistTabletLaunch(tok);
        window.location.href = `${window.location.origin}/tablet?token=${encodeURIComponent(tok)}`;
        return;
      }
      if (!cancelled) setAutoRedirectDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!autoRedirectDone) return;
    let cancelled = false;
    (async () => {
      try {
        const last = await getStoredTabletLaunchUrl();
        if (cancelled || !last) return;
        setUrl(last);
        try {
          const u = new URL(last);
          const tok = u.searchParams.get("token");
          if (tok) setDeviceToken(tok);
        } catch {
          /* ignore */
        }
        setHint("Last saved link loaded — you can edit and open again.");
      } catch {
        /* private mode */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [autoRedirectDone]);

  const redirectTo = async (href) => {
    try {
      await persistTabletLaunchUrl(href);
    } catch {
      /* ignore */
    }
    window.location.replace(href);
  };

  const submitFullUrl = async (e) => {
    e.preventDefault();
    setError("");
    let raw = String(url || "").trim();
    if (!raw) {
      setError("Paste the full tablet link from Admin → Devices.");
      return;
    }

    try {
      if (!/^https?:\/\//i.test(raw)) {
        raw = `${window.location.origin}${raw.startsWith("/") ? "" : "/"}${raw}`;
      }
      const target = new URL(raw);
      if (target.origin !== window.location.origin) {
        const tok = target.searchParams.get("token");
        if (!tok || String(tok).trim().length < 8) {
          setError(
            "For a deployed server (https://…), the link must include ?token=… or use “Device token only” with the token from Admin → Devices."
          );
          return;
        }
        await persistTabletLaunch(String(tok).trim());
        window.location.replace(target.toString());
        return;
      }
      const path = target.pathname + target.search;
      if (path.startsWith("/tablet/connect")) {
        setError("Use a tablet device link, not the connect page URL.");
        return;
      }
      if (!path.startsWith("/tablet")) {
        setError("The link must start with /tablet (TABLET device from Devices).");
        return;
      }
      await redirectTo(target.toString());
    } catch {
      setError("That doesn’t look like a valid URL.");
    }
  };

  const submitTokenOnly = async (e) => {
    e.preventDefault();
    setError("");
    const t = String(deviceToken).trim();
    if (!t) {
      setError("Paste the device token from Admin → Devices (TABLET).");
      return;
    }
    const href = `${window.location.origin}/tablet?token=${encodeURIComponent(t)}`;
    await redirectTo(href);
  };

  if (!autoRedirectDone) {
    return (
      <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col justify-center px-4 py-10 pb-nav-safe text-center text-slate-400">
        <p className="text-lg font-medium text-white">Restoring tablet…</p>
        <p className="mt-2 text-sm">Loading saved device link</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col justify-center px-4 py-10 pb-nav-safe">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Restaurant tablet</p>
        <h1 className="mt-1 text-xl font-bold text-white">Connect this device</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Admin: <strong className="text-slate-200">Devices</strong> → <strong className="text-slate-200">TABLET</strong> → copy
          the link or the <strong className="text-slate-200">device token</strong> only (no restaurant ID needed). Same on{" "}
          <strong className="text-slate-200">Android and iOS</strong>.
        </p>

        <div className="mt-5 flex rounded-xl border border-slate-600 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("url");
              setError("");
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              mode === "url" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Paste full link
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("token");
              setError("");
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              mode === "token" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Device token only
          </button>
        </div>

        {mode === "url" ? (
          <form onSubmit={submitFullUrl} className="mt-6 space-y-4">
            <div>
              <label htmlFor="tablet-url" className="block text-xs font-medium text-slate-500">
                Tablet URL (from Admin)
              </label>
              <textarea
                id="tablet-url"
                rows={3}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com/tablet?token=…"
                className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-600"
                autoComplete="off"
                spellCheck={false}
                inputMode="url"
              />
            </div>
            {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
            {error ? <p className="text-sm text-amber-200">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-500"
            >
              Open tablet
            </button>
          </form>
        ) : (
          <form onSubmit={submitTokenOnly} className="mt-6 space-y-4">
            <div>
              <label htmlFor="device-token" className="block text-xs font-medium text-slate-500">
                Device token
              </label>
              <input
                id="device-token"
                type="password"
                value={deviceToken}
                onChange={(e) => setDeviceToken(e.target.value)}
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
        )}

        <p className="mt-6 border-t border-slate-700 pt-4 text-xs text-slate-500">
          <a href="/tablet/connect?choose=1" className="text-indigo-400 hover:text-indigo-300">
            Use a different tablet / paste a new link
          </a>
          <span className="mx-2 text-slate-600">·</span>
          Store builds: set Capacitor <code className="rounded bg-slate-800 px-1 text-slate-300">server.url</code> to{" "}
          <code className="rounded bg-slate-800 px-1 text-slate-300">…/tablet/connect</code> (
          <code className="rounded bg-slate-800 px-1 text-slate-300">CAP_TABLET_PATH=/tablet/connect</code>).
        </p>
      </div>
    </div>
  );
}
