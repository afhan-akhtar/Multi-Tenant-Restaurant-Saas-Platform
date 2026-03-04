import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword } from "./password";

import { getServerSession } from "next-auth";

export const authOptions = {
  providers: [
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

          // Restaurant Admin login: subdomain provided OR email+password only (find staff by email across tenants)
          const useSubdomain = subdomain && subdomain.length > 0;
          if (useSubdomain) {
            const tenant = await prisma.tenant.findFirst({
              where: { subdomain, status: "ACTIVE" },
            });
            if (!tenant) return null;

            const staff = await prisma.staff.findFirst({
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

          // Restaurant Admin login: email+password only (search staff across all ACTIVE tenants)
          const staffList = await prisma.staff.findMany({
            where: { email: { equals: email, mode: "insensitive" }, status: "ACTIVE" },
            include: { role: true, tenant: true },
          });
          for (const staff of staffList) {
            if (staff.tenant?.status !== "ACTIVE") continue;
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

          // Super Admin login
          const admin = await prisma.superAdmin.findUnique({
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
  pages: {
    signIn: "/login",
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
