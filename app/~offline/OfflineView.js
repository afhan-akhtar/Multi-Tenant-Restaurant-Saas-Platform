"use client";

import Link from "next/link";

export function OfflineView() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-100">
      <p className="text-sm font-medium uppercase tracking-widest text-slate-500">You are offline</p>
      <h1 className="text-2xl font-semibold sm:text-3xl">No network connection</h1>
      <p className="max-w-md text-slate-400">
        Pages you have opened before in this app may still be available. Reconnect to sync data and
        use live features.
      </p>
      <p className="text-sm text-slate-500">Try again when you are back online, or return home.</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
