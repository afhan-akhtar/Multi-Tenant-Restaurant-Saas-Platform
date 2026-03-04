import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  const isRestaurantLogin = /^\/[^/]+\/login$/.test(pathname);

  // Public routes
  const isPublic =
    pathname === "/login" ||
    pathname === "/go" ||
    pathname === "/admin" ||
    isRestaurantLogin ||
    pathname === "/register" ||
    pathname === "/api/register" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp)$/);

  if (isPublic) {
    return;
  }

  if (!token) {
    const isSuperAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
    const restaurantMatch = pathname.match(/^\/([^/]+)(?:\/|$)/);
    const loginPath = isSuperAdminRoute ? "/admin" : (restaurantMatch ? `/${restaurantMatch[1]}/login` : "/login");
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  return;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
