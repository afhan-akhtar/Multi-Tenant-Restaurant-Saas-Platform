import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { provisionTenantDatabaseAndMigrate } from "@/lib/provision-tenant-database";
import { syncStaffLoginLookup } from "@/lib/staff-login-lookup";
import { hashPassword } from "@/lib/password";

// POST /api/register - Tenant self-registration (creates PENDING tenant)
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      restaurantName,
      branchName,
      country,
      ownerName,
      email,
      password,
    } = body;

    if (!restaurantName?.trim() || !branchName?.trim() || !ownerName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Restaurant name, branch name, owner name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanedSubdomain = restaurantName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (cleanedSubdomain.length < 2) {
      return NextResponse.json(
        { error: "Restaurant name must produce a valid URL slug (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();

    const existingSubdomain = await platformPrisma.tenant.findUnique({
      where: { subdomain: cleanedSubdomain },
    });
    if (existingSubdomain) {
      return NextResponse.json(
        { error: `A restaurant with slug "${cleanedSubdomain}" already exists. Please choose a different restaurant name.` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const countryVal = (country || "").trim();

    let tenant;
    try {
      tenant = await platformPrisma.tenant.create({
        data: {
          name: restaurantName.trim(),
          subdomain: cleanedSubdomain,
          country: countryVal,
          status: "PENDING",
        },
      });
    } catch (createErr) {
      // In dev environments it's possible to have the autoincrement sequence out of sync
      // (e.g. manual inserts/seeds). If we hit a duplicate id, repair the sequence and retry once.
      if (createErr?.code === "P2002" && String(createErr?.meta?.modelName || "") === "Tenant") {
        console.warn("[register] Tenant create unique constraint; repairing sequence and retrying once.");
        await platformPrisma.$executeRaw`
          SELECT setval(
            pg_get_serial_sequence('"Tenant"', 'id'),
            (SELECT COALESCE(MAX(id), 0) FROM "Tenant")
          )
        `;
        tenant = await platformPrisma.tenant.create({
          data: {
            name: restaurantName.trim(),
            subdomain: cleanedSubdomain,
            country: countryVal,
            status: "PENDING",
          },
        });
      } else {
        throw createErr;
      }
    }

    try {
      await provisionTenantDatabaseAndMigrate(tenant.id);
    } catch (provErr) {
      console.error("[register] provision failed", provErr);
      await platformPrisma.tenant.delete({ where: { id: tenant.id } }).catch(() => {});
      return NextResponse.json(
        { error: "Could not create restaurant database. Check server logs and DATABASE_ADMIN_URL / PostgreSQL access." },
        { status: 500 }
      );
    }

    const tp = await getTenantPrisma(tenant.id);

    const tenantAdmin = await tp.$transaction(async (tx) => {
      // If a previous provisioning attempt created the DB already, the Tenant row may exist.
      // Upsert avoids a hard failure on duplicate id.
      await tx.tenant.upsert({
        where: { id: tenant.id },
        create: {
          id: tenant.id,
          name: restaurantName.trim(),
          subdomain: cleanedSubdomain,
          country: countryVal,
          status: "PENDING",
        },
        update: {
          name: restaurantName.trim(),
          subdomain: cleanedSubdomain,
          country: countryVal,
          status: "PENDING",
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
        data: {
          tenantId: tenant.id,
          name: "Owner",
        },
      });

      return tx.tenantAdmin.create({
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

    await syncStaffLoginLookup(emailTrimmed, tenant.id, tenantAdmin.id);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Your restaurant is pending approval. You will be able to log in once approved by the Super Admin.",
      subdomain: tenant.subdomain,
    });
  } catch (err) {
    console.error("[register] Error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
