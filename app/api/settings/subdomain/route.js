import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { isReservedRootSegment } from "@/lib/tenant-url";

function normalizeSubdomain(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// PATCH /api/settings/subdomain - Restaurant admin can change tenant subdomain.
export async function PATCH(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (token.type === "super_admin") {
      return NextResponse.json({ error: "Super Admin cannot use this endpoint." }, { status: 400 });
    }

    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const desired = normalizeSubdomain(body?.subdomain);

    if (!desired || desired.length < 2) {
      return NextResponse.json({ error: "Subdomain must be at least 2 characters." }, { status: 400 });
    }
    if (desired.length > 40) {
      return NextResponse.json({ error: "Subdomain must be 40 characters or less." }, { status: 400 });
    }
    if (isReservedRootSegment(desired) || desired === "www") {
      return NextResponse.json({ error: "This subdomain is reserved. Choose a different one." }, { status: 400 });
    }

    const current = await platformPrisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, subdomain: true, databaseUrl: true, status: true },
    });
    if (!current) return NextResponse.json({ error: "Tenant not found." }, { status: 404 });

    if (current.subdomain === desired) {
      return NextResponse.json({ success: true, subdomain: desired });
    }

    const existing = await platformPrisma.tenant.findUnique({
      where: { subdomain: desired },
      select: { id: true },
    });
    if (existing && existing.id !== tenantId) {
      return NextResponse.json({ error: "This subdomain is already taken." }, { status: 409 });
    }

    await platformPrisma.tenant.update({
      where: { id: tenantId },
      data: { subdomain: desired },
    });

    if (current.databaseUrl?.trim()) {
      try {
        const tp = await getTenantPrisma(tenantId);
        await tp.tenant.update({
          where: { id: tenantId },
          data: { subdomain: desired },
        });
      } catch (e) {
        console.error("[settings subdomain] tenant DB sync failed", e);
      }
    }

    return NextResponse.json({ success: true, subdomain: desired });
  } catch (err) {
    console.error("[settings subdomain PATCH]", err);
    return NextResponse.json({ error: "Failed to update subdomain." }, { status: 500 });
  }
}

