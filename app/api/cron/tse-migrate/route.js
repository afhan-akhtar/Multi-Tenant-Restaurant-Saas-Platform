import { prisma } from "@/lib/db";
import { signTransaction } from "@/lib/tse";
import { NextResponse } from "next/server";

/**
 * Daily cron: migrate pending TSE queue items (orders, cancellations, cashbook).
 * Failed TSE signings are auto-queued; this cron retries them.
 * Call: GET /api/cron/tse-migrate?secret=YOUR_CRON_SECRET
 * Set CRON_SECRET in env; configure Vercel cron or system cron to run daily.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    const querySecret = new URL(request.url).searchParams.get("secret");
    const bearerMatch = authHeader?.match(/^Bearer\s+(.+)$/);
    const token = bearerMatch?.[1] ?? querySecret;
    if (token !== secret) {
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
        const payload = item.payload || {};
        const result = await signTransaction({
          type: payload.type || "SALE",
          tenantId: item.tenantId,
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          amount: payload.amount,
          fn: payload.fn || "Beleg",
        });

        const txType = payload.transactionType || "ORDER";
        const isOrder = ["ORDER", "CANCELLATION"].includes(txType) || !!payload.orderId;

        await prisma.tSETransaction.create({
          data: {
            orderId: isOrder ? (payload.orderId ?? null) : null,
            cashbookEntryId: !isOrder ? (payload.cashbookEntryId ?? null) : null,
            transactionType: txType,
            signature: result.signature || String(result.transactionId),
            fiskalyTxId: String(result.transactionId),
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
          data: { status: "FAILED", errorMsg: String(err?.message || err).slice(0, 500) },
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
