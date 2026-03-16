import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Receipt } from "@/app/components/Receipt";
import { getTenantTaxInfo } from "@/lib/tse/org";

export default async function ReceiptPage({ params }) {
  const id = parseInt(params.id, 10);
  if (!id) notFound();

  const session = await auth();
  const tenantId = session?.user?.tenantId ?? null;
  if (!tenantId) notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      // `logoUrl` is not yet on Tenant in the current DB schema
      tenant: { select: { name: true } },
      branch: true,
      orderItems: true,
      payments: true,
      tseTransactions: {
        where: { transactionType: "ORDER" },
        orderBy: { signedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!order || order.tenantId !== tenantId) notFound();

  const tseTx = order.tseTransactions?.[0];
  const rawPayload = (tseTx?.rawPayload && typeof tseTx.rawPayload === "object") ? tseTx.rawPayload : {};

  const { isOrderTseQueued } = await import("@/lib/tse/db");
  const tseQueued = await isOrderTseQueued(id);

  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const receiptUrl = `${proto}://${host}/receipt/${id}`;

  const orgTaxInfo = await getTenantTaxInfo(tenantId);

  const receipt = {
    orderNumber: order.orderNumber,
    orderId: order.id,
    tenantName: order.tenant?.name || "Restaurant",
    tenantLogo: null,
    branchName: order.branch?.name || "",
    branchAddress: `${order.branch?.address || ""}, ${order.branch?.city || ""}, ${order.branch?.country || ""}`.replace(/^,\s*|,\s*$/g, "").trim(),
    date: order.createdAt?.toISOString?.() || new Date(order.createdAt).toISOString(),
    receiptUrl,
    items: (order.orderItems || []).map((it) => ({
      name: it.productName,
      qty: it.quantity,
      unitPrice: Number(it.unitPrice),
      total: Number(it.totalAmount),
      taxRate: Number(it.taxRate) || 0,
    })),
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    discountAmount: Number(order.discountAmount),
    grandTotal: Number(order.grandTotal),
    payments: (order.payments || []).map((p) => ({ method: p.method, amount: Number(p.amount) })),
    orgVat: orgTaxInfo?.vatId ?? null,
    orgTaxNumber: orgTaxInfo?.taxNumber ?? null,
    orgWidnr: orgTaxInfo?.widnr ?? null,

    // Backward-compatible fields used by Receipt.js
    tseSignature: tseTx?.signature ?? null,
    tseTransactionId: tseTx?.fiskalyTxId ?? null,
    tseSignedAt: tseTx?.signedAt ? new Date(tseTx.signedAt).toISOString() : null,
    tseQueued,

    // Fiskaly API receipt fields (KassenSichV)
    tss_id: rawPayload?.tssId ?? null,
    tx_id: tseTx?.fiskalyTxId ?? null,
    signature_counter: rawPayload?.signatureCounter ?? null,
    log_time_start: rawPayload?.logTimeStart ?? null,
    log_time_end: rawPayload?.logTimeEnd ?? null,
    signature: tseTx?.signature ?? null,
    tseQrData: rawPayload?.qrCodeData ?? null,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Receipt receipt={receipt} embedded />
    </div>
  );
}
