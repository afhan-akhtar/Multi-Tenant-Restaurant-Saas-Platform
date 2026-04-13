import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { provisionTenantDatabaseAndMigrate } from "@/lib/provision-tenant-database";
import { syncStaffLoginLookup } from "@/lib/staff-login-lookup";
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

    const existing = await platformPrisma.tenant.findUnique({ where: { subdomain: cleanedSubdomain } });
    if (existing) {
      return NextResponse.json({ error: `Subdomain "${cleanedSubdomain}" is already taken.` }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const countryVal = (country || "").trim();

    const tenant = await platformPrisma.tenant.create({
      data: {
        name: restaurantName.trim(),
        subdomain: cleanedSubdomain,
        country: countryVal,
        status: "ACTIVE",
      },
    });

    try {
      await provisionTenantDatabaseAndMigrate(tenant.id);
    } catch (provErr) {
      console.error("[super-admin tenants create] provision failed", provErr);
      await platformPrisma.tenant.delete({ where: { id: tenant.id } }).catch(() => {});
      return NextResponse.json(
        { error: "Could not create tenant database. Check DATABASE_ADMIN_URL and PostgreSQL." },
        { status: 500 }
      );
    }

    const tp = await getTenantPrisma(tenant.id);

    await tp.$transaction(async (tx) => {
      await tx.tenant.create({
        data: {
          id: tenant.id,
          name: restaurantName.trim(),
          subdomain: cleanedSubdomain,
          country: countryVal,
          status: "ACTIVE",
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

      await tx.tenantAdmin.create({
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
    });

    const adminRow = await tp.tenantAdmin.findFirst({
      where: { tenantId: tenant.id, email: emailTrimmed },
    });
    if (adminRow) {
      await syncStaffLoginLookup(emailTrimmed, tenant.id, adminRow.id);
    }

    await ensureTenantOnboardingSubscription(platformPrisma, tenant.id);

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
      },
    });
  } catch (err) {
    console.error("[super-admin tenants create]", err);
    return NextResponse.json({ error: "Failed to create tenant." }, { status: 500 });
  }
}
