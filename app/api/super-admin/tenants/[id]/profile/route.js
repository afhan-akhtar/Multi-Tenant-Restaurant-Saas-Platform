import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";

// PATCH — Super Admin: restaurant profile (platform registry + tenant DB mirror)
export async function PATCH(req, { params }) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params?.id ?? "", 10);
    if (!id) {
      return NextResponse.json({ error: "Invalid tenant ID" }, { status: 400 });
    }

    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const logoUrl = body?.logoUrl != null ? String(body.logoUrl).trim() : undefined;
    const country = body?.country != null ? String(body.country).trim() : undefined;

    if (!name) {
      return NextResponse.json({ error: "Restaurant name is required." }, { status: 400 });
    }

    const tenant = await platformPrisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const data = {
      name,
      ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
      ...(country !== undefined && { country }),
    };

    await platformPrisma.tenant.update({
      where: { id },
      data,
    });

    if (tenant.databaseUrl?.trim()) {
      try {
        const tp = await getTenantPrisma(id);
        await tp.tenant.update({
          where: { id },
          data,
        });
      } catch (e) {
        console.error("[super-admin tenant profile] tenant DB sync", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[super-admin tenant profile]", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
