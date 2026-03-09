import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ReceiptPrintButton } from "@/app/components/ReceiptPrintButton";
import { ReceiptQRCode } from "@/app/components/ReceiptQRCode";

const ACCENT = "#14b8a6";

export default async function ReceiptPage({ params }) {
  const id = parseInt(params.id, 10);
  if (!id) notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      tenant: true,
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

  if (!order) notFound();

  const tseTx = order.tseTransactions?.[0];
  const rawPayload = (tseTx?.rawPayload && typeof tseTx.rawPayload === "object") ? tseTx.rawPayload : {};
  const tseData = tseTx
    ? {
        signature: tseTx.signature,
        fiskalyTxId: tseTx.fiskalyTxId,
        signedAt: tseTx.signedAt,
        qrCodeData: rawPayload.qrCodeData ?? null,
      }
    : null;

  const { isOrderTseQueued } = await import("@/lib/tse/db");
  const tseQueued = await isOrderTseQueued(id);

  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const receiptUrl = `${proto}://${host}/receipt/${id}`;

  const tenantName = order.tenant?.name || "Restaurant";
  const branchName = order.branch?.name || "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div style={{ background: ACCENT, height: 4 }} />
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="font-bold text-xl">{tenantName}</h1>
            {branchName && (
              <p className="text-sm text-gray-600 mt-1">{branchName}</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="font-semibold">Receipt</h2>
            <div className="text-right text-sm">
              <div>Nr. {order.orderNumber}</div>
              <div className="text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <table className="w-full border-collapse text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2">DESCRIPTION</th>
                <th className="py-2 text-right w-12">QTY</th>
                <th className="py-2 text-right w-14">VAT</th>
                <th className="py-2 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((it) => {
                const rate = Number(it.taxRate) || 10;
                const gross = Number(it.totalAmount) * (1 + rate / 100);
                return (
                  <tr key={it.id} className="border-b border-gray-100">
                    <td className="py-2">{it.productName}</td>
                    <td className="py-2 text-right">{it.quantity}</td>
                    <td className="py-2 text-right">{rate}%</td>
                    <td className="py-2 text-right">
                      €{gross.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="space-y-1 text-right mb-6 border-t border-gray-200 pt-3">
            <div>Sum excl. VAT: €{Number(order.subtotal).toFixed(2)}</div>
            <div>Tax: €{Number(order.taxAmount).toFixed(2)}</div>
            {Number(order.discountAmount) > 0 && (
              <div className="text-amber-600">
                Discount: -€{Number(order.discountAmount).toFixed(2)}
              </div>
            )}
            <div className="font-bold text-lg">
              Total: €{Number(order.grandTotal).toFixed(2)}
            </div>
          </div>

          <div
            style={{ background: ACCENT }}
            className="px-4 py-3 rounded-lg text-white mb-4"
          >
            <div className="text-xs font-medium mb-2">Payment</div>
            {order.payments.map((p) => (
              <div
                key={p.id}
                className="flex justify-between text-sm"
              >
                <span>{p.method}</span>
                <span>€{Number(p.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
            <div className="font-medium text-xs text-gray-700">Fiskaly TSE (KassenSichV)</div>
            {tseData ? (
              <div className="text-xs break-all space-y-1">
                <div><span className="text-gray-500">Signature:</span> {String(tseData.signature).slice(0, 80)}{String(tseData.signature).length > 80 ? "…" : ""}</div>
                <div><span className="text-gray-500">Tx ID:</span> {tseData.fiskalyTxId}</div>
                <div><span className="text-gray-500">Signed:</span> {new Date(tseData.signedAt).toLocaleString()}</div>
              </div>
            ) : tseQueued ? (
              <div className="text-amber-600 text-xs">Pending (will be signed by daily migration)</div>
            ) : (
              <div className="text-amber-600 text-xs">Pending (TSE signing failed; check server logs)</div>
            )}
          </div>

          <ReceiptQRCode url={receiptUrl} tseQrData={tseData?.qrCodeData} />

          <div className="mb-6">
            <ReceiptPrintButton />
          </div>

          <div style={{ background: ACCENT, height: 4 }} />
          <p className="text-center py-6 text-gray-600 text-sm">
            Thank you for your order!
          </p>
        </div>
      </div>
    </div>
  );
}
