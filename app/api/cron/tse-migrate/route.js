import { prisma } from "@/lib/db";
import { signTransaction } from "@/lib/tse";
import { NextResponse } from "next/server";

/**
 * Daily cron: migrate pending TSE queue items (orders, cancellations, cashbook).
 * Failed TSE signings are auto-queued; this cron retries them.
 * Triggered by Vercel cron (2:00 UTC). No auth required.
 */
export async function GET() {
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
