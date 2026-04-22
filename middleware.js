import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  buildRootUrl,
  buildTenantUrl,
  getHostInfo,
  getTenantInternalPath,
  isReservedRootSegment,
} from "@/lib/tenant-url";

function nextWithPathHeaders(request, pathname, isTenantHost) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-is-tenant-host", isTenantHost ? "1" : "0");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(/:$/, "") || "http";
  const { subdomain: currentSubdomain, isTenantHost } = getHostInfo(host);

  // /public assets (e.g. *.js) — must not be rewritten as /{tenant}/… or login HTML will be returned for .js URLs
  if (pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|js|mjs|css|map|txt|json|woff2?)$/i)) {
    return nextWithPathHeaders(request, pathname, isTenantHost);
  }
  const tenantSubdomain = token?.type === "staff" ? token?.subdomain : "";
  const pathnameWithSearch = `${pathname}${search || ""}`;
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";

  // API routes: let through, API handles auth and returns 401 if needed
  if (pathname.startsWith("/api/")) {
    return nextWithPathHeaders(request, pathname, isTenantHost);
  }

  // Password reset UIs live on the root host; keep links working from tenant subdomains
  if (isTenantHost && pathname === "/forgot-password") {
    const u = new URL(buildRootUrl({ host, protocol, pathname: "/forgot-password" }));
    for (const [k, v] of request.nextUrl.searchParams) u.searchParams.set(k, v);
    return NextResponse.redirect(u);
  }
  if (isTenantHost && pathname === "/reset-password") {
    const u = new URL(buildRootUrl({ host, protocol, pathname: "/reset-password" }));
    const t = request.nextUrl.searchParams.get("token");
    if (t) u.searchParams.set("token", t);
    return NextResponse.redirect(u);
  }

  if (isTenantHost && (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/register")) {
    return NextResponse.redirect(buildRootUrl({ host, protocol, pathname: pathnameWithSearch }));
  }

  // Move old path-based tenant URLs like /demo/products to demo.localhost/products
  if (!isTenantHost && firstSegment && !isReservedRootSegment(firstSegment)) {
    const tenantPath = pathname === `/${firstSegment}` ? "/" : pathname.slice(firstSegment.length + 1) || "/";
    const tenantPathWithSearch = `${tenantPath}${search || ""}`;
    return NextResponse.redirect(
      buildTenantUrl({
        host,
        protocol,
        subdomain: firstSegment,
        pathname: tenantPathWithSearch,
      })
    );
  }

  if (token?.type === "super_admin" && isTenantHost) {
    return NextResponse.redirect(buildRootUrl({ host, protocol, pathname: "/admin" }));
  }

  if (tenantSubdomain) {
    if (isTenantHost && currentSubdomain !== tenantSubdomain) {
      return NextResponse.redirect(
        buildTenantUrl({
          host,
          protocol,
          subdomain: tenantSubdomain,
          pathname: pathnameWithSearch,
        })
      );
    }

    if (!isTenantHost && !pathname.startsWith("/admin") && pathname !== "/register" && pathname !== "/") {
      const targetPath = pathname === "/go" ? "/" : pathnameWithSearch;
      return NextResponse.redirect(
        buildTenantUrl({
          host,
          protocol,
          subdomain: tenantSubdomain,
          pathname: targetPath,
        })
      );
    }
  }

  // Tenant /login → rewrite to the tenant login form (keeps cookie on the subdomain domain)
  if (isTenantHost && pathname === "/login") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getTenantInternalPath(currentSubdomain, "/login");
    const res = NextResponse.rewrite(rewriteUrl);
    res.headers.set("x-pathname", pathname);
    res.headers.set("x-is-tenant-host", "1");
    return res;
  }

  // Public routes
  const isPublic =
    (!isTenantHost && pathname === "/") ||
    pathname === "/menu" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/go" ||
    pathname === "/admin" ||
    pathname === "/register" ||
    pathname.startsWith("/receipt/") ||
    pathname === "/ws" ||
    pathname === "/api/register" ||
    pathname.startsWith("/pos/") ||
    pathname.startsWith("/kds/") ||
    pathname === "/tablet" ||
    pathname.startsWith("/tablet/") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp)$/);

  if (isPublic) {
    return nextWithPathHeaders(request, pathname, isTenantHost);
  }

  if (!token) {
    // Tenant home without login → root landing page (not login page)
    if (isTenantHost && pathname === "/") {
      return NextResponse.redirect(buildRootUrl({ host, protocol, pathname: "/" }));
    }

    // Every other protected route → unified root login form
    const loginUrl = new URL(buildRootUrl({ host, protocol, pathname: "/login" }));
    // Only attach callbackUrl for non-trivial paths — "/" and "/admin" are the
    // default post-login destinations already handled by the login form.
    if (pathnameWithSearch !== "/" && pathnameWithSearch !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", pathnameWithSearch);
    }
    return Response.redirect(loginUrl);
  }

  if (isTenantHost) {
    // These root-level routes must not be rewritten with the tenant prefix,
    // as they live in app/invoice/... (not app/[restaurant]/...)
    const ROOT_ONLY_SEGMENTS = new Set(["invoice"]);
    if (ROOT_ONLY_SEGMENTS.has(firstSegment)) {
      return nextWithPathHeaders(request, pathname, isTenantHost);
    }
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getTenantInternalPath(currentSubdomain, pathname);
    const res = NextResponse.rewrite(rewriteUrl);
    // Browser URL path (e.g. /, /orders) so layouts can tell login vs app routes
    res.headers.set("x-pathname", pathname);
    res.headers.set("x-is-tenant-host", "1");
    return res;
  }

  return nextWithPathHeaders(request, pathname, isTenantHost);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
