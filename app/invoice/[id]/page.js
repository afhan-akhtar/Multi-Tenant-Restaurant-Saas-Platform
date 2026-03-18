import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatEur } from "@/lib/currencyFormat";
import { formatDate } from "@/lib/dateFormat";

export default async function InvoicePage({ params }) {
  const id = Number(params?.id);
  if (!id) notFound();

  const session = await auth();
  if (!session) notFound();

  const invoice = await prisma.billingInvoice.findUnique({
    where: { id },
    include: {
      tenant: true,
      plan: true,
      subscription: true,
      payments: {
        orderBy: { paidAt: "desc" },
      },
    },
  });

  if (!invoice) notFound();

  const isSuperAdmin = session.user?.type === "super_admin";
  const tenantId = session.user?.tenantId ?? null;
  if (!isSuperAdmin && invoice.tenantId !== tenantId) {
    notFound();
  }

  const lineItems = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];

  return (
    <div className="min-h-screen bg-color-bg px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-color-border bg-color-card shadow-sm">
        <div className="border-b border-color-border px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-color-text-muted">
                Invoice
              </div>
              <h1 className="m-0 mt-1 text-2xl font-semibold text-color-text">{invoice.invoiceNumber}</h1>
              <p className="m-0 mt-2 text-sm text-color-text-muted">
                {invoice.tenant?.name} • {invoice.plan?.name}
              </p>
            </div>
            <div className="text-sm text-color-text-muted">
              <div>Issued: {formatDate(invoice.issuedAt)}</div>
              <div>Due: {formatDate(invoice.dueDate)}</div>
              <div>Status: {invoice.status}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
          <div>
            <h2 className="m-0 mb-3 text-base font-semibold text-color-text">Billing Period</h2>
            <div className="space-y-2 text-sm text-color-text-muted">
              <div>From: {formatDate(invoice.periodStart)}</div>
              <div>To: {formatDate(invoice.periodEnd)}</div>
              <div>Currency: {invoice.currency}</div>
              <div>Plan commission: {Number(invoice.plan?.commissionPercent || 0)}%</div>
            </div>
          </div>
          <div>
            <h2 className="m-0 mb-3 text-base font-semibold text-color-text">Restaurant</h2>
            <div className="space-y-2 text-sm text-color-text-muted">
              <div>Name: {invoice.tenant?.name}</div>
              <div>Subdomain: {invoice.tenant?.subdomain}</div>
              <div>Subscription ID: {invoice.subscriptionId}</div>
              <div>Notes: {invoice.notes || "—"}</div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h2 className="m-0 mb-3 text-base font-semibold text-color-text">Line Items</h2>
          <div className="overflow-hidden rounded-lg border border-color-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-color-border bg-color-bg">
                  <th className="px-4 py-3 text-left font-semibold text-color-text">Item</th>
                  <th className="px-4 py-3 text-left font-semibold text-color-text">Description</th>
                  <th className="px-4 py-3 text-right font-semibold text-color-text">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => (
                  <tr key={`${item.code || "line"}-${index}`} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-color-text">{item.label || item.code || "Line item"}</td>
                    <td className="px-4 py-3 text-color-text-muted">{item.description || "—"}</td>
                    <td className="px-4 py-3 text-right text-color-text">{formatEur(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 border-t border-color-border px-6 py-6 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="m-0 mb-3 text-base font-semibold text-color-text">Payments</h2>
            {invoice.payments.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-color-border">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-color-border bg-color-bg">
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Paid At</th>
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Method</th>
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Reference</th>
                      <th className="px-4 py-3 text-right font-semibold text-color-text">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 text-color-text-muted">{formatDate(payment.paidAt)}</td>
                        <td className="px-4 py-3 text-color-text">{payment.method}</td>
                        <td className="px-4 py-3 text-color-text-muted">{payment.reference || "—"}</td>
                        <td className="px-4 py-3 text-right text-color-text">{formatEur(payment.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-color-border px-4 py-5 text-sm text-color-text-muted">
                No payments recorded yet.
              </div>
            )}
          </div>
          <div>
            <h2 className="m-0 mb-3 text-base font-semibold text-color-text">Totals</h2>
            <div className="space-y-2 rounded-lg border border-color-border bg-color-bg px-4 py-4 text-sm">
              <div className="flex justify-between gap-4"><span className="text-color-text-muted">Subtotal</span><span className="text-color-text">{formatEur(invoice.subtotal)}</span></div>
              <div className="flex justify-between gap-4"><span className="text-color-text-muted">Tax</span><span className="text-color-text">{formatEur(invoice.taxAmount)}</span></div>
              <div className="flex justify-between gap-4 border-t border-color-border pt-2 font-semibold"><span className="text-color-text">Total</span><span className="text-color-text">{formatEur(invoice.totalAmount)}</span></div>
            </div>
            <div className="mt-4">
              <Link href={isSuperAdmin ? "/admin/subscriptions" : `/${session.user?.subdomain}/subscription`} className="text-sm font-medium text-primary no-underline">
                Back to subscription management
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
