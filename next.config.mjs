import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import withSerwistInit from "@serwist/next";

function getOfflineRevision() {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.CI_COMMIT_SHA;
  if (fromEnv) return String(fromEnv).trim();
  const git = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" });
  if (git.status === 0 && git.stdout?.trim()) return git.stdout.trim();
  return randomUUID();
}

// Set NEXT_PUBLIC_ENABLE_PWA_IN_DEV=1 to test Serwist + SW during `next dev` (HMR can be noisier).
const enablePwaInDev = process.env.NEXT_PUBLIC_ENABLE_PWA_IN_DEV === "1";

const withSerwist = withSerwistInit({
  // Default: off in dev for Fast Refresh. Opt-in with NEXT_PUBLIC_ENABLE_PWA_IN_DEV=1.
  disable: process.env.NODE_ENV === "development" && !enablePwaInDev,
  swSrc: "app/sw.js",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision: getOfflineRevision() }],
  cacheOnNavigation: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["demo.localhost", "*.localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
