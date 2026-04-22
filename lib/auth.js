import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import { platformPrisma } from "./platform-db";
import { getTenantPrisma } from "./tenant-db";
import { verifyPassword } from "./password";

import { getServerSession } from "next-auth";

function getCookieDomain() {
  const configuredRoot =
    process.env.ROOT_DOMAIN?.trim() ||
    process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim() ||
    "";

  const candidate = configuredRoot || process.env.NEXTAUTH_URL || "";

  if (!candidate) return undefined;

  try {
    const hostname = candidate.includes("://") ? new URL(candidate).hostname : candidate;
    const normalized = hostname.replace(/^\./, "").toLowerCase();

    if (!normalized || normalized === "127.0.0.1") {
      return undefined;
    }

    if (normalized === "localhost" || normalized.endsWith(".localhost")) {
      // Do NOT set Domain= for localhost — Chrome treats Domain=localhost as
      // host-only for "localhost" and won't send it to "demo.localhost".
      // Returning undefined makes the cookie host-only for whichever host
      // the browser actually sent the sign-in request to (e.g. demo.localhost).
      return undefined;
    }

    return normalized;
  } catch {
    return undefined;
  }
}

const cookieDomain = getCookieDomain();
const useSecureCookies = (process.env.NEXTAUTH_URL || "").startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

function verifyImpersonateToken(token) {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadStr);
    if (payload.exp && Date.now() > payload.exp) return null;
    const expected = crypto
      .createHmac("sha256", process.env.NEXTAUTH_SECRET)
      .update(payloadStr)
      .digest("base64url");
    if (sig !== expected) return null;
    return { staffId: payload.staffId, tenantId: payload.tenantId };
  } catch {
    return null;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "impersonate",
      name: "Impersonate",
      credentials: { token: { label: "Token", type: "text" } },
      async authorize(credentials) {
        const token = credentials?.token;
        if (!token) return null;
        const payload = verifyImpersonateToken(token);
        if (!payload?.staffId || !payload?.tenantId) return null;
        const tenantPrisma = await getTenantPrisma(payload.tenantId);
        const staff = await tenantPrisma.tenantAdmin.findUnique({
          where: { id: payload.staffId, status: "ACTIVE" },
          include: { role: true, tenant: true },
        });
        if (!staff || staff.tenant?.status !== "ACTIVE") return null;
        return {
          id: String(staff.id),
          email: staff.email,
          name: staff.name,
          type: "staff",
          tenantId: staff.tenantId,
          tenantName: staff.tenant?.name,
          subdomain: staff.tenant?.subdomain,
          branchId: staff.branchId,
          roleId: staff.roleId,
          roleName: staff.role?.name,
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        subdomain: { label: "Subdomain", type: "text" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim?.()?.toLowerCase();
          const password = credentials?.password;
          const subdomain = credentials?.subdomain?.trim?.()?.toLowerCase();

          if (!email || !password) return null;

          const useSubdomain = subdomain && subdomain.length > 0;
          if (useSubdomain) {
            const tenant = await platformPrisma.tenant.findFirst({
              where: { subdomain, status: "ACTIVE" },
            });
            if (!tenant?.databaseUrl) return null;

            const tenantPrisma = await getTenantPrisma(tenant.id);
            const staff = await tenantPrisma.tenantAdmin.findFirst({
              where: {
                tenantId: tenant.id,
                email,
                status: "ACTIVE",
              },
              include: { role: true, tenant: true },
            });
            if (!staff) return null;

            const valid = await verifyPassword(password, staff.passwordHash);
            if (!valid) return null;

            return {
              id: String(staff.id),
              email: staff.email,
              name: staff.name,
              type: "staff",
              tenantId: staff.tenantId,
              tenantName: staff.tenant?.name,
              subdomain: staff.tenant?.subdomain,
              branchId: staff.branchId,
              roleId: staff.roleId,
              roleName: staff.role?.name,
            };
          }

          const lookups = await platformPrisma.staffLoginLookup.findMany({
            where: { email },
          });
          for (const lookup of lookups) {
            const platformTenant = await platformPrisma.tenant.findUnique({
              where: { id: lookup.tenantId },
            });
            if (!platformTenant?.databaseUrl || platformTenant.status !== "ACTIVE") {
              continue;
            }
            const tenantPrisma = await getTenantPrisma(lookup.tenantId);
            const staff = await tenantPrisma.tenantAdmin.findFirst({
              where: {
                id: lookup.staffId,
                email,
                status: "ACTIVE",
              },
              include: { role: true, tenant: true },
            });
            if (!staff) continue;
            const valid = await verifyPassword(password, staff.passwordHash);
            if (valid) {
              return {
                id: String(staff.id),
                email: staff.email,
                name: staff.name,
                type: "staff",
                tenantId: staff.tenantId,
                tenantName: staff.tenant?.name,
                subdomain: staff.tenant?.subdomain,
                branchId: staff.branchId,
                roleId: staff.roleId,
                roleName: staff.role?.name,
              };
            }
          }

          const admin = await platformPrisma.superAdmin.findUnique({
            where: { email },
          });
          if (!admin) {
            if (process.env.NODE_ENV === "development") {
              console.log("[auth] SuperAdmin not found for email:", email);
            }
            return null;
          }

          const valid = await verifyPassword(password, admin.passwordHash);
          if (!valid) {
            if (process.env.NODE_ENV === "development") {
              console.log("[auth] Password mismatch for:", email);
            }
            return null;
          }

          return {
            id: String(admin.id),
            email: admin.email,
            name: admin.name,
            type: "super_admin",
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
        token.subdomain = user.subdomain;
        token.branchId = user.branchId;
        token.roleId = user.roleId;
        token.roleName = user.roleName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.type = token.type;
        session.user.tenantId = token.tenantId;
        session.user.tenantName = token.tenantName;
        session.user.subdomain = token.subdomain;
        session.user.branchId = token.branchId;
        session.user.roleId = token.roleId;
        session.user.roleName = token.roleName;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: "/login",
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
