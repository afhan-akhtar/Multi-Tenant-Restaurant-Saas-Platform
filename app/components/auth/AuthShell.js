"use client";

import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

/** Shared with landing: warm light bg, teal accents, slate text */
export const auth = {
  card: "w-full max-w-[420px] rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xl shadow-stone-300/40 sm:p-8",
  cardNarrow: "w-full max-w-[400px] rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xl shadow-stone-300/40 sm:p-8",
  title: "m-0 mb-1 text-2xl font-semibold tracking-tight text-slate-900",
  subtitle: "m-0 mb-6 text-sm text-slate-600",
  label: "mb-1 block text-sm font-medium text-slate-700",
  input:
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-teal-500/15 placeholder:text-slate-400 box-border focus:border-teal-500 focus:ring-2",
  select:
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-teal-500/15 box-border focus:border-teal-500 focus:ring-2",
  btnPrimary:
    "inline-flex w-full items-center justify-center rounded-full border-0 bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-base font-semibold text-white shadow-md shadow-teal-600/25 transition hover:from-teal-700 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-70",
  link: "font-medium text-teal-700 no-underline hover:text-teal-800 hover:underline",
  muted: "text-sm text-slate-600",
  error: "text-sm text-red-600",
};

export const authDisplayFont = fraunces.className;

export function AuthShell({ children }) {
  return (
    <div
      className={`${jakarta.className} relative min-h-screen min-h-[100dvh] box-border overflow-x-hidden bg-[#f6f4f0] text-slate-800 antialiased`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[20%] -top-[10%] h-[min(520px,65vh)] w-[min(640px,80vw)] rounded-[50%] bg-gradient-to-br from-teal-200/40 via-cyan-100/25 to-transparent blur-3xl" />
        <div className="absolute -right-[12%] top-[15%] h-[min(420px,50vh)] w-[min(480px,70vw)] rounded-[50%] bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f4f0_0%,#f0faf8_40%,#f6f4f0_100%)]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,#94a3b814_1px,transparent_1px),linear-gradient(to_bottom,#94a3b814_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      <div className="relative z-10 flex w-full min-h-[100dvh] min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
        {children}
      </div>
    </div>
  );
}
