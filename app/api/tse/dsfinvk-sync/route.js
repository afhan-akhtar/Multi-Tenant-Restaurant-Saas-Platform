import { getToken } from "next-auth/jwt";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { submitCashPointClosing } from "@/lib/tse/dsfinvk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Sync TSE transactions + cashbook to Fiskaly DSFinV-K so they appear in the dashboard.
 * POST body: { date?: "YYYY-MM-DD" } – defaults to today.
 * Requires FISKALY_MANAGED_ORG_ID.
 */
export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = token.tenantId ?? null;
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenant context" }, { status: 400 });
    }

    let body = {};
    try {
      body = await request.json().catch(() => ({}));
    } catch (_) {}
    const dateStr = body.date || new Date().toISOString().slice(0, 10);
    const start = new Date(dateStr + "T00:00:00.000Z");
    const end = new Date(dateStr + "T23:59:59.999Z");

    const prisma = await getTenantPrisma(tenantId);
    const [tseOrder, tseCashbook, cashbookEntries] = await Promise.all([
      prisma.tSETransaction.findMany({
        where: { orderId: { not: null }, order: { tenantId }, signedAt: { gte: start, lte: end } },
        include: { order: true },
        orderBy: { signedAt: "asc" },
      }),
      prisma.tSETransaction.findMany({
        where: { cashbookEntryId: { not: null }, cashbookEntry: { tenantId }, signedAt: { gte: start, lte: end } },
        include: { cashbookEntry: true },
        orderBy: { signedAt: "asc" },
      }),
      prisma.cashbookEntry.findMany({
        where: { tenantId, createdAt: { gte: start, lte: end } },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const tseTransactions = [...tseOrder, ...tseCashbook].sort(
      (a, b) => new Date(a.signedAt) - new Date(b.signedAt)
    );

    for (const t of tseOrder) {
      if (t.order) {
        t.rawPayload = t.rawPayload || {};
        t.rawPayload.grandTotal = Number(t.order.grandTotal);
      }
    }

    // Use DSFINVK_CLIENT_ID if set (e.g. UUID from Fiskaly Dashboard Cash Registers list)
    let clientId = process.env.DSFINVK_CLIENT_ID?.trim?.() || "pos-1";
    const apiKey = process.env.FISKALY_API_KEY?.trim?.();
    if (apiKey && !process.env.DSFINVK_CLIENT_ID) {
      const platformConfig = await platformPrisma.fiskalyPlatformConfig.findUnique({ where: { apiKey } });
      if (platformConfig?.clientId) clientId = platformConfig.clientId;
    }
    const tenantConfig = tenantId && (await prisma.tenantFiskalyConfig.findUnique({ where: { tenantId } }));
    if (tenantConfig?.clientId && !process.env.DSFINVK_CLIENT_ID) clientId = tenantConfig.clientId;

    const result = await submitCashPointClosing({
      clientId,
      businessDate: dateStr,
      tseTransactions,
      cashbookEntries,
    });

    return NextResponse.json({ ok: result.ok, synced: result.synced ?? 0, date: dateStr });
  } catch (err) {
    console.error("[dsfinvk-sync]", err);
    return NextResponse.json(
      { error: err?.message || "Sync failed" },
      { status: 500 }
    );
  }
}
