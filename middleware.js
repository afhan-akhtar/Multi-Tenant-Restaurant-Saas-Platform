import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  buildRootUrl,
  buildTenantUrl,
  getHostInfo,
  getTenantInternalPath,
  isReservedRootSegment,
} from "@/lib/tenant-url";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname, search } = request.nextUrl;

  // /public assets (e.g. *.js) — must not be rewritten as /{tenant}/… or login HTML will be returned for .js URLs
  if (pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|js|mjs|css|map|txt|json|woff2?)$/i)) {
    return NextResponse.next();
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(/:$/, "") || "http";
  const { subdomain: currentSubdomain, isTenantHost } = getHostInfo(host);
  const tenantSubdomain = token?.type === "staff" ? token?.subdomain : "";
  const pathnameWithSearch = `${pathname}${search || ""}`;
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";

  // API routes: let through, API handles auth and returns 401 if needed
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
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

    if (!isTenantHost && !pathname.startsWith("/admin") && pathname !== "/register") {
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

  // Set header so layout knows we're on login page (for auth redirect logic)
  if (isTenantHost && pathname === "/login") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getTenantInternalPath(currentSubdomain, pathname);
    const res = NextResponse.rewrite(rewriteUrl);
    res.headers.set("x-restaurant-login", "1");
    return res;
  }

  // Public routes
  const isPublic =
    pathname === "/menu" ||
    pathname === "/login" ||
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
    return NextResponse.next();
  }

  if (!token) {
    const isSuperAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
    const loginPath = isSuperAdminRoute ? "/admin" : "/login";
    const loginUrl = isSuperAdminRoute || !isTenantHost
      ? new URL(loginPath, request.url)
      : new URL(
          buildTenantUrl({
            host,
            protocol,
            subdomain: currentSubdomain,
            pathname: loginPath,
          })
        );
    if (!isSuperAdminRoute && !isTenantHost && pathname === "/") {
      loginUrl.searchParams.set("signup", "1");
    }
    loginUrl.searchParams.set("callbackUrl", pathnameWithSearch);
    return Response.redirect(loginUrl);
  }

  if (isTenantHost) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getTenantInternalPath(currentSubdomain, pathname);
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
