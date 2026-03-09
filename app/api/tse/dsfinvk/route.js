import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * DSFinV-K export for tax audits.
 * Returns JSON export of TSE transactions, cashbook, and orders for the given date range.
 */
export async function GET(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "401" }, { status: 401 });
    }

    const tenantId = token.tenantId ?? null;
    if (!tenantId) {
      return NextResponse.json({ error: "400 Missing tenant context" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");
    const start = startStr ? new Date(startStr) : new Date(new Date().setHours(0, 0, 0, 0));
    const end = endStr ? new Date(endStr) : new Date();

    const [tseOrder, tseCashbook, cashbookEntries, orders] = await Promise.all([
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
      prisma.order.findMany({
        where: { tenantId, createdAt: { gte: start, lte: end } },
        include: { orderItems: true, payments: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const tseTransactions = [...tseOrder, ...tseCashbook].sort(
      (a, b) => new Date(a.signedAt) - new Date(b.signedAt)
    );

    const exportData = {
      exportDate: new Date().toISOString(),
      tenantId,
      start: start.toISOString(),
      end: end.toISOString(),
      tseTransactions: tseTransactions.map((t) => ({
        id: t.id,
        transactionType: t.transactionType,
        signature: t.signature,
        fiskalyTxId: t.fiskalyTxId,
        signedAt: t.signedAt,
        orderId: t.orderId,
        cashbookEntryId: t.cashbookEntryId,
        rawPayload: t.rawPayload,
      })),
      cashbookEntries: cashbookEntries.map((e) => ({
        id: e.id,
        type: e.type,
        amount: Number(e.amount),
        referenceId: e.referenceId,
        createdAt: e.createdAt,
      })),
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        grandTotal: Number(o.grandTotal),
        createdAt: o.createdAt,
        items: o.orderItems,
        payments: o.payments,
      })),
    };

    const format = searchParams.get("format") || "json";
    if (format === "csv") {
      const csv = [
        "TSE Transactions",
        "id,transactionType,signature,fiskalyTxId,signedAt,orderId,cashbookEntryId",
        ...tseTransactions.map((t) =>
          [t.id, t.transactionType, t.signature, t.fiskalyTxId, t.signedAt, t.orderId, t.cashbookEntryId].join(",")
        ),
        "",
        "Cashbook",
        "id,type,amount,referenceId,createdAt",
        ...cashbookEntries.map((e) => [e.id, e.type, e.amount, e.referenceId, e.createdAt].join(",")),
      ].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="dsfinvk-${tenantId}-${start.toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json(exportData);
  } catch (err) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
