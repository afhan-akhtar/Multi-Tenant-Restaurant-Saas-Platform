/**
 * Canonical public base URL (email links, redirects). Prefer NEXTAUTH_URL.
 */
export function getAppBaseUrl() {
  const u = process.env.NEXTAUTH_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (u) {
    return u.startsWith("http") ? u.replace(/\/$/, "") : `https://${u.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
