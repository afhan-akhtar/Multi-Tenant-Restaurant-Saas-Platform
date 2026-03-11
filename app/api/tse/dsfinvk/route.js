import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import JSZip from "jszip";

export const dynamic = "force-dynamic";

/**
 * DSFinV-K export for tax audits.
 * Returns JSON, CSV, or ZIP (DS-FinV-K compliant with index.xml) for the given date range.
 * ZIP format: index.xml + Bonkopf, Bonpos, TSE_Transactions, Cashbook CSVs per BMF spec.
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

    if (format === "zip") {
      const zip = new JSZip();
      const dateRange = `${start.toISOString().slice(0, 10)}_${end.toISOString().slice(0, 10)}`;

      const escapeCsv = (v) => {
        const s = String(v ?? "");
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
      };

      const BonkopfHeader = "Beleg-ID;Belegtyp;Belegdatum;Gesamtbetrag;Waehrung;TSE-Signatur;TSE-Transaktions-ID";
      const BonkopfRows = tseTransactions.map((t) => {
        const amount = t.orderId
          ? (orders.find((o) => o.id === t.orderId)?.grandTotal ?? 0)
          : (t.rawPayload?.amount ?? 0);
        const belegtyp = t.transactionType === "CASH_DEPOSIT" ? "Einlage" : t.transactionType === "CASH_WITHDRAWAL" ? "Entnahme" : "Kassenbeleg";
        return [t.id, belegtyp, new Date(t.signedAt).toISOString(), Number(amount).toFixed(2), "EUR", t.signature?.slice(0, 64) ?? "", t.fiskalyTxId].map(escapeCsv).join(";");
      });

      const BonposHeader = "Beleg-ID;Belegpos-ID;Artikel;Menge;Einzelpreis;Gesamtpreis";
      const BonposRows = [];
      for (const o of orders) {
        for (let i = 0; i < (o.orderItems?.length ?? 0); i++) {
          const item = o.orderItems[i];
          BonposRows.push([o.id, i + 1, item?.productName ?? "", item?.quantity ?? 0, Number(item?.unitPrice ?? 0).toFixed(2), Number(item?.totalAmount ?? 0).toFixed(2)].map(escapeCsv).join(";"));
        }
      }

      const TSEHeader = "ID;Transaktionstyp;Signatur;Fiskaly-Tx-ID;Signiert-am;Order-ID;Cashbook-ID";
      const TSERows = tseTransactions.map((t) =>
        [t.id, t.transactionType, t.signature ?? "", t.fiskalyTxId ?? "", new Date(t.signedAt).toISOString(), t.orderId ?? "", t.cashbookEntryId ?? ""].map(escapeCsv).join(";")
      );

      const CashbookHeader = "ID;Typ;Betrag;Referenz-ID;Erstellt-am";
      const CashbookRows = cashbookEntries.map((e) =>
        [e.id, e.type, Number(e.amount).toFixed(2), e.referenceId ?? "", new Date(e.createdAt).toISOString()].map(escapeCsv).join(";")
      );

      zip.file("Bonkopf.csv", BonkopfHeader + "\n" + BonkopfRows.join("\n"));
      zip.file("Bonpos.csv", BonposHeader + "\n" + BonposRows.join("\n"));
      zip.file("TSE_Transactions.csv", TSEHeader + "\n" + TSERows.join("\n"));
      zip.file("Cashbook.csv", CashbookHeader + "\n" + CashbookRows.join("\n"));

      const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<Export xmlns="https://www.bzst.de/2017/dfue/Export">
  <Version>2.3</Version>
  <Erstellungszeitpunkt>${new Date().toISOString()}</Erstellungszeitpunkt>
  <Exportzeitraum>
    <Von>${start.toISOString()}</Von>
    <Bis>${end.toISOString()}</Bis>
  </Exportzeitraum>
  <Tenant-ID>${tenantId}</Tenant-ID>
  <Dateien>
    <Datei Name="Bonkopf.csv" Typ="Bonkopf" Encoding="UTF-8"/>
    <Datei Name="Bonpos.csv" Typ="Bonpos" Encoding="UTF-8"/>
    <Datei Name="TSE_Transactions.csv" Typ="TSE_Transactions" Encoding="UTF-8"/>
    <Datei Name="Cashbook.csv" Typ="Cashbook" Encoding="UTF-8"/>
  </Dateien>
</Export>`;
      zip.file("index.xml", indexXml);

      const blob = await zip.generateAsync({ type: "nodebuffer" });
      return new NextResponse(blob, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="dsfinvk-${tenantId}-${dateRange}.zip"`,
        },
      });
    }

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
