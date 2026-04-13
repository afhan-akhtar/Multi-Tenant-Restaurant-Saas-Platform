import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";

// GET /api/settings - Get current user's tenant or platform settings
export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (token.type === "super_admin") {
      const tenants = await prisma.tenant.count();
      const plans = await prisma.subscriptionPlan.count();
      return NextResponse.json({
        type: "platform",
        tenantsCount: tenants,
        plansCount: plans,
      });
    }

    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, subdomain: true, country: true, status: true },
    });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    return NextResponse.json({ type: "tenant", tenant });
  } catch (err) {
    console.error("[settings GET]", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PATCH /api/settings - Update tenant settings (restaurant admin only)
export async function PATCH(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (token.type === "super_admin") {
      return NextResponse.json({ error: "Use Restaurant Management for platform changes" }, { status: 400 });
    }

    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const body = await req.json();
    const { name, country } = body;

    const updates = {};
    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (typeof country === "string") updates.country = country.trim() || "";

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid updates" }, { status: 400 });
    }

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updates,
      select: { id: true, name: true, subdomain: true, country: true },
    });

    return NextResponse.json({ success: true, tenant });
  } catch (err) {
    console.error("[settings PATCH]", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
