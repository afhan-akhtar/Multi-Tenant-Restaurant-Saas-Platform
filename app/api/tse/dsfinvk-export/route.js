import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { downloadDsfinvkExport, triggerDsfinvkExport } from "@/lib/tse/dsfinvk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Trigger a Fiskaly DSFinV-K export and return the ZIP/TAR.
 * POST body:
 *  - { businessDateStart?: "YYYY-MM-DD", businessDateEnd?: "YYYY-MM-DD", format?: "zip"|"tar" }
 */
export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Missing tenant context" }, { status: 400 });

    let body = {};
    try {
      body = await request.json().catch(() => ({}));
    } catch (_) {}

    const businessDateStart = body.businessDateStart || body.start_date || body.date || new Date().toISOString().slice(0, 10);
    const businessDateEnd = body.businessDateEnd || body.end_date || body.date || businessDateStart;
    const format = body.format === "tar" ? "tar" : "zip";

    // Prefer explicit DSFINVK_CLIENT_ID (UUID from Fiskaly dashboard cash register list)
    let clientId = process.env.DSFINVK_CLIENT_ID?.trim?.() || "pos-1";
    const apiKey = process.env.FISKALY_API_KEY?.trim?.();
    if (apiKey && !process.env.DSFINVK_CLIENT_ID) {
      const platformConfig = await prisma.fiskalyPlatformConfig.findUnique({ where: { apiKey } });
      if (platformConfig?.clientId) clientId = platformConfig.clientId;
    }
    const tenantConfig = await prisma.tenantFiskalyConfig.findUnique({ where: { tenantId } });
    if (tenantConfig?.clientId && !process.env.DSFINVK_CLIENT_ID) clientId = tenantConfig.clientId;

    const { exportId } = await triggerDsfinvkExport({
      clientId,
      format,
      businessDateStart,
      businessDateEnd,
    });

    const { buf, contentType } = await downloadDsfinvkExport({ exportId, format });
    const filename = `dsfinvk-${clientId}-${businessDateStart}_${businessDateEnd}.${format === "tar" ? "tar" : "zip"}`;

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[dsfinvk-export]", err);
    return NextResponse.json({ error: err?.message || "Export failed" }, { status: 500 });
  }
}

