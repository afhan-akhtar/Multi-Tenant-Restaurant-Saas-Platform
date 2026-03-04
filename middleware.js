import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // Public routes
  const isPublic =
    pathname === "/login" ||
    pathname === "/admin" ||
    pathname === "/register" ||
    pathname === "/api/register" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp)$/);

  if (isPublic) {
    return;
  }

  if (!token) {
    const superAdminPaths = ["/restaurants", "/subscriptions", "/commission", "/logs", "/impersonation"];
    const isSuperAdminRoute = superAdminPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
    const loginPath = isSuperAdminRoute ? "/admin" : "/login";
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  return;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
