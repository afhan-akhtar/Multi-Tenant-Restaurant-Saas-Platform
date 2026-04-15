import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";

// GET /api/public/tenant-status?subdomain=foo
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = String(searchParams.get("subdomain") || "");
    const subdomain = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!subdomain || subdomain.length < 2) {
      return NextResponse.json({ error: "Invalid subdomain" }, { status: 400 });
    }

    const tenant = await platformPrisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true, subdomain: true, status: true },
    });

    if (!tenant) {
      return NextResponse.json({ exists: false, status: "NOT_FOUND" });
    }

    return NextResponse.json({ exists: true, status: tenant.status, subdomain: tenant.subdomain });
  } catch (err) {
    console.error("[public tenant-status]", err);
    return NextResponse.json({ error: "Failed to check tenant status" }, { status: 500 });
  }
}

