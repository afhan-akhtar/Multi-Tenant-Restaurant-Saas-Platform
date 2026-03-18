import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { ensureTenantOnboardingSubscription } from "@/lib/subscriptions";

// POST /api/super-admin/tenants - Create tenant manually (Super Admin onboard)
export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurantName, branchName, subdomain, country, ownerName, email, password } = body;

    if (!restaurantName?.trim() || !branchName?.trim() || !subdomain?.trim() || !ownerName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Restaurant name, branch name, subdomain, owner name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanedSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (cleanedSubdomain.length < 2) {
      return NextResponse.json(
        { error: "Subdomain must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const emailTrimmed = email.trim().toLowerCase();

    const existing = await prisma.tenant.findUnique({ where: { subdomain: cleanedSubdomain } });
    if (existing) {
      return NextResponse.json({ error: `Subdomain "${cleanedSubdomain}" is already taken.` }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const countryVal = (country || "").trim();
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: restaurantName.trim(),
          subdomain: cleanedSubdomain,
          country: countryVal,
          status: "ACTIVE", // Immediate activation when Super Admin adds
        },
      });

      const branch = await tx.branch.create({
        data: {
          tenantId: tenant.id,
          name: branchName.trim(),
          address: "",
          city: "",
          country: countryVal,
        },
      });

      const role = await tx.role.create({
        data: { tenantId: tenant.id, name: "Owner" },
      });

      const tenantAdmin = await tx.tenantAdmin.create({
        data: {
          tenantId: tenant.id,
          branchId: branch.id,
          roleId: role.id,
          name: ownerName.trim(),
          email: emailTrimmed,
          passwordHash,
          status: "ACTIVE",
        },
      });

      await ensureTenantOnboardingSubscription(tx, tenant.id);

      return { tenant, tenantAdmin };
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        subdomain: result.tenant.subdomain,
        status: result.tenant.status,
      },
    });
  } catch (err) {
    console.error("[super-admin tenants create]", err);
    return NextResponse.json({ error: "Failed to create tenant." }, { status: 500 });
  }
}
