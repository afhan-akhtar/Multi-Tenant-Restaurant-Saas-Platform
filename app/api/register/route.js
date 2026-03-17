import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

    // Generate slug from restaurant name: lowercase, alphanumeric + hyphen only
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

    // Check subdomain uniqueness
    const existingSubdomain = await prisma.tenant.findUnique({
      where: { subdomain: cleanedSubdomain },
    });
    if (existingSubdomain) {
      return NextResponse.json(
        { error: `A restaurant with slug "${cleanedSubdomain}" already exists. Please choose a different restaurant name.` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Transaction: create tenant, branch, role, staff
    const result = await prisma.$transaction(async (tx) => {
      const countryVal = (country || "").trim();
      const tenant = await tx.tenant.create({
        data: {
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

      return { tenant, branch, role, tenantAdmin };
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. Your restaurant is pending approval. You will be able to log in once approved by the Super Admin.",
      subdomain: result.tenant.subdomain,
    });
  } catch (err) {
    console.error("[register] Error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
