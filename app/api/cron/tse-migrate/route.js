import { getTenantPrisma } from "@/lib/tenant-db";
import { platformPrisma } from "@/lib/platform-db";
import { signTransaction } from "@/lib/tse";
import { signAndStoreCancellation } from "@/lib/tse/db";
import { NextResponse } from "next/server";

/**
 * Daily cron: migrate pending TSE queue items (orders, cancellations, cashbook).
 * Iterates each tenant database.
 */
export async function GET() {
  try {
    const tenants = await platformPrisma.tenant.findMany({
      where: { databaseUrl: { not: null } },
      select: { id: true },
    });

    let migrated = 0;
    let failed = 0;
    let total = 0;

    for (const t of tenants) {
      const prisma = await getTenantPrisma(t.id);
      const pending = await prisma.tSEQueue.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        take: 100,
      });
      total += pending.length;

      for (const item of pending) {
        try {
          const payload = item.payload || {};
          const txType = payload.transactionType || "ORDER";

          if (txType === "CANCELLATION" || payload.type === "CANCELLATION") {
            const storno = await signAndStoreCancellation(
              item.tenantId,
              payload.orderId,
              payload.orderNumber,
              Number(payload.amount) || 0,
              {
                tsePaymentBreakdown: payload.tsePaymentBreakdown,
                refundedItemIds: payload.refundedItemIds,
                batchKey: payload.batchKey,
                reason: payload.reason,
                suppressQueue: true,
              }
            );
            if (storno?.skipped) {
              await prisma.tSEQueue.update({
                where: { id: item.id },
                data: {
                  status: "FAILED",
                  errorMsg: String(storno.code || "CANCELLATION_SKIPPED").slice(0, 500),
                },
              });
              failed++;
              continue;
            }
            if (!storno?.transactionId) {
              throw new Error("CANCELLATION_SIGN_EMPTY");
            }
            await prisma.tSEQueue.update({
              where: { id: item.id },
              data: { status: "MIGRATED", migratedAt: new Date() },
            });
            migrated++;
            continue;
          }

          const result = await signTransaction({
            type: payload.type || "SALE",
            tenantId: item.tenantId,
            orderId: payload.orderId,
            orderNumber: payload.orderNumber,
            amount: payload.amount,
            fn: payload.fn || "Beleg",
            vatBuckets: payload.vatBuckets,
            payments: payload.payments,
          });

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
    }

    return NextResponse.json({ ok: true, migrated, failed, total });
  } catch (err) {
    console.error("[TSE migrate cron]", err);
    return NextResponse.json({ error: err.message || "Migration failed" }, { status: 500 });
  }
}
