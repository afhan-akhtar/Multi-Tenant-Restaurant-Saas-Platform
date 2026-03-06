import { prisma } from "@/lib/db";
import { signTransaction } from "@/lib/tse";
import { NextResponse } from "next/server";

/**
 * Daily cron: migrate pending TSE queue items (e.g. offline-synced orders).
 * Call via: GET /api/cron/tse-migrate?secret=YOUR_CRON_SECRET
 * Set CRON_SECRET in env and configure your cron (Vercel, etc.) to call this daily.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("secret") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const pending = await prisma.tSEQueue.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    let migrated = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        const payload = item.payload;
        const result = await signTransaction({
          type: payload.type || "SALE",
          tenantId: item.tenantId,
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          amount: payload.amount,
          fn: payload.fn || "Beleg",
        });

        await prisma.tSETransaction.create({
          data: {
            orderId: payload.orderId ?? null,
            transactionType: payload.transactionType || "ORDER",
            signature: result.signature,
            fiskalyTxId: result.transactionId,
            signedAt: new Date(result.timestamp),
            rawPayload: payload,
          },
        });

        await prisma.tSEQueue.update({
          where: { id: item.id },
          data: { status: "MIGRATED", migratedAt: new Date() },
        });
        migrated++;
      } catch (err) {
        console.error("[TSE migrate item]", item.id, err);
        await prisma.tSEQueue.update({
          where: { id: item.id },
          data: { status: "FAILED", errorMsg: err.message?.slice(0, 500) },
        });
        failed++;
      }
    }

    return NextResponse.json({ ok: true, migrated, failed, total: pending.length });
  } catch (err) {
    console.error("[TSE migrate cron]", err);
    return NextResponse.json({ error: err.message || "Migration failed" }, { status: 500 });
  }
}
