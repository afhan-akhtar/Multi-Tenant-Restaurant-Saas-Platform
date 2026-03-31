import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Receipt } from "@/app/components/Receipt";
import { getTenantTaxInfo } from "@/lib/tse/org";
import { verifyReceiptAccessToken } from "@/lib/receipt-access";

export default async function StornoReceiptPage({ params, searchParams }) {
  const id = parseInt(params.id, 10);
  if (!id) notFound();

  const session = await auth();
  const tenantId = session?.user?.tenantId ?? null;
  const access = String(searchParams?.access || "").trim();
  const receiptAccess = access ? verifyReceiptAccessToken(access) : null;
  const allowedTenantId = tenantId ?? receiptAccess?.tenantId ?? null;

  if (!allowedTenantId) notFound();

  if (receiptAccess?.orderId && receiptAccess.orderId !== id) notFound();

  const tsePk = Number.parseInt(String(searchParams?.tse || ""), 10);
  const cancelWhere = {
    orderId: id,
    transactionType: "CANCELLATION",
    ...(Number.isFinite(tsePk) && tsePk > 0 ? { id: tsePk } : {}),
  };

  const cancelTx = await prisma.tSETransaction.findFirst({
    where: cancelWhere,
    orderBy: { signedAt: "desc" },
  });

  if (!cancelTx) notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      tenant: { select: { name: true } },
      branch: true,
      payments: true,
    },
  });

  if (!order || order.tenantId !== allowedTenantId) notFound();

  const rawPayload = cancelTx.rawPayload && typeof cancelTx.rawPayload === "object" ? cancelTx.rawPayload : {};
  const refundAmount = Number(rawPayload.refundAmount) || 0;
  const originalTxId = rawPayload.originalFiskalyTxId ?? null;

  const orgTaxInfo = await getTenantTaxInfo(allowedTenantId);

  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const receiptUrl = `${proto}://${host}/receipt/${id}/storno${tsePk ? `?tse=${cancelTx.id}` : ""}`;

  const stornoPayments =
    Array.isArray(rawPayload.tsePaymentBreakdown) && rawPayload.tsePaymentBreakdown.length > 0
      ? rawPayload.tsePaymentBreakdown.map((p) => ({
          method: p.method,
          amount: -Math.abs(Number(p.amount) || 0),
        }))
      : [{ method: "Rückerstattung", amount: -refundAmount }];

  const receipt = {
    isStorno: true,
    stornoOriginalTxId: originalTxId,
    stornoReason: rawPayload.reason ?? null,
    orderNumber: order.orderNumber,
    orderId: order.id,
    tenantName: order.tenant?.name || "Restaurant",
    tenantLogo: null,
    branchName: order.branch?.name || "",
    branchAddress: `${order.branch?.address || ""}, ${order.branch?.city || ""}, ${order.branch?.country || ""}`
      .replace(/^,\s*|,\s*$/g, "")
      .trim(),
    date: cancelTx.signedAt?.toISOString?.() || new Date(cancelTx.signedAt).toISOString(),
    receiptUrl,
    items: [],
    subtotal: -refundAmount,
    taxAmount: 0,
    discountAmount: 0,
    grandTotal: -refundAmount,
    payments: stornoPayments.length ? stornoPayments : [{ method: "REFUND", amount: -refundAmount }],
    cashReceived: null,
    changeGiven: null,
    orgVat: orgTaxInfo?.vatId ?? null,
    orgTaxNumber: orgTaxInfo?.taxNumber ?? null,
    orgWidnr: orgTaxInfo?.widnr ?? null,

    tseSignature: cancelTx.signature ?? null,
    tseTransactionId: cancelTx.fiskalyTxId ?? null,
    tseSignedAt: cancelTx.signedAt ? new Date(cancelTx.signedAt).toISOString() : null,
    tseQueued: false,

    tss_id: rawPayload?.tssId ?? null,
    tx_id: cancelTx.fiskalyTxId ?? null,
    signature_counter: rawPayload?.signatureCounter ?? null,
    log_time_start: rawPayload?.logTimeStart ?? null,
    log_time_end: rawPayload?.logTimeEnd ?? null,
    signature: cancelTx.signature ?? null,
    tseQrData: rawPayload?.qrCodeData ?? null,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Receipt receipt={receipt} embedded />
    </div>
  );
}
