import { auth } from "@/lib/auth";
import { platformPrisma } from "@/lib/platform-db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatEur } from "@/lib/currencyFormat";
import { buildPlanFeatures } from "@/lib/subscriptionPlans";
import { formatDate } from "@/lib/dateFormat";
import { getTenantSubscriptionAccess } from "@/lib/subscriptions";
import SubscriptionStripePaymentCard from "@/app/components/SubscriptionStripePaymentCard";
import SubscriptionPlanRequestActions from "@/app/components/SubscriptionPlanRequestActions";

export const dynamic = "force-dynamic";

function getStatusTone(status) {
  if (status === "ACTIVE" || status === "PAID") return { background: "#dcfce7", color: "#166534" };
  if (status === "TRIALING") return { background: "#dbeafe", color: "#1d4ed8" };
  if (status === "GRACE_PERIOD" || status === "OPEN") return { background: "#fef3c7", color: "#b45309" };
  if (status === "PAST_DUE" || status === "OVERDUE") return { background: "#fde68a", color: "#92400e" };
  if (status === "EXPIRED") return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#e5e7eb", color: "#374151" };
}

export default async function RestaurantSubscriptionPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p className="text-color-text-muted">Restaurant context required.</p>
      </div>
    );
  }

  const [access, plans, planChangeRequests] = await Promise.all([
    getTenantSubscriptionAccess(tenantId),
    platformPrisma.subscriptionPlan.findMany({
      orderBy: [{ sortOrder: "asc" }, { monthlyPrice: "asc" }],
    }),
    platformPrisma.subscriptionPlanChangeRequest.findMany({
      where: { tenantId },
      include: {
        requestedPlan: true,
      },
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  const normalizedSubscription = access.subscription;
  const normalizedPlans = plans.map((plan) => ({
    ...plan,
    description: plan.description || "",
    monthlyPrice: Number(plan.monthlyPrice),
    commissionPercent: Number(plan.commissionPercent),
    trialDays: Number(plan.trialDays || 0),
    graceDays: Number(plan.graceDays || 0),
    features: buildPlanFeatures(plan.features),
  }));
  const payments = normalizedSubscription?.invoices?.flatMap((invoice) =>
    (invoice.payments || []).map((payment) => ({
      ...payment,
      invoiceNumber: invoice.invoiceNumber,
    }))
  ) || [];
  const payableInvoice =
    normalizedSubscription?.invoices?.find(
      (invoice) => invoice.status === "OPEN" || invoice.status === "OVERDUE"
    ) || null;
  const pendingPlanRequest = planChangeRequests.find((request) => request.status === "PENDING") || null;

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">My Subscription</h2>

      {normalizedSubscription ? (
        <div className="space-y-6">
          {access.billingIssue && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {access.billingIssue}
            </div>
          )}

          {payableInvoice && (
            <SubscriptionStripePaymentCard
              invoiceId={payableInvoice.id}
              invoiceNumber={payableInvoice.invoiceNumber}
              amount={payableInvoice.totalAmount}
            />
          )}

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-color-card rounded-lg border border-color-border p-6">
              <h3 className="m-0 mb-4 text-base font-semibold text-color-text">Current Plan</h3>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Plan</span><span className="font-medium text-color-text">{normalizedSubscription.plan?.name}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Status</span><span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={getStatusTone(normalizedSubscription.status)}>{normalizedSubscription.status}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Monthly fee</span><span className="font-medium text-color-text">{formatEur(normalizedSubscription.plan?.monthlyPrice)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Commission</span><span className="font-medium text-color-text">{Number(normalizedSubscription.plan?.commissionPercent)}%</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Trial ends</span><span className="font-medium text-color-text">{formatDate(normalizedSubscription.trialEndDate)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Grace ends</span><span className="font-medium text-color-text">{formatDate(normalizedSubscription.gracePeriodEndsAt)}</span></div>
                <div className="sm:col-span-2 flex justify-between gap-4"><span className="text-color-text-muted">Billing period</span><span className="font-medium text-color-text">{formatDate(normalizedSubscription.startDate)} – {formatDate(normalizedSubscription.endDate)}</span></div>
              </div>
              <div className="mt-5 border-t border-color-border pt-4">
                <div className="mb-3 text-sm font-medium text-color-text">Enabled features</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(normalizedSubscription.plan?.featureMatrix || []).map((feature) => (
                    <div key={feature.code} className={`rounded-lg border px-3 py-3 ${feature.enabled ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                      <div className="font-medium text-color-text">{feature.label}</div>
                      <div className="mt-1 text-xs text-color-text-muted">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-color-card rounded-lg border border-color-border p-6">
              <h3 className="m-0 mb-4 text-base font-semibold text-color-text">Billing Snapshot</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Invoices</span><span className="font-medium text-color-text">{normalizedSubscription.invoices?.length || 0}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Payments</span><span className="font-medium text-color-text">{payments.length}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Auto renew</span><span className="font-medium text-color-text">{normalizedSubscription.autoRenew ? "Enabled" : "Disabled"}</span></div>
                <div className="flex justify-between gap-4"><span className="text-color-text-muted">Latest invoice</span><span className="font-medium text-color-text">{normalizedSubscription.invoices?.[0]?.invoiceNumber || "—"}</span></div>
              </div>
              <div className="mt-4 rounded-lg border border-color-border bg-color-bg px-3 py-3 text-xs text-color-text-muted">
                To change plans, submit a request from the available plans below. The selected plan will activate automatically after approval.
              </div>
            </div>
          </div>

          <div className="bg-color-card rounded-lg border border-color-border overflow-hidden">
            <div className="border-b border-color-border px-4 py-3 text-base font-semibold text-color-text">Invoices</div>
            <div className="w-full overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-color-border bg-color-bg">
                    <th className="px-4 py-3 text-left font-semibold text-color-text">Invoice</th>
                    <th className="px-4 py-3 text-left font-semibold text-color-text">Period</th>
                    <th className="px-4 py-3 text-left font-semibold text-color-text">Due</th>
                    <th className="px-4 py-3 text-left font-semibold text-color-text">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-color-text">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(normalizedSubscription.invoices || []).map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3"><Link href={`/invoice/${invoice.id}`} className="font-medium text-primary no-underline">{invoice.invoiceNumber}</Link></td>
                      <td className="px-4 py-3 text-color-text-muted">{formatDate(invoice.periodStart)} – {formatDate(invoice.periodEnd)}</td>
                      <td className="px-4 py-3 text-color-text-muted">{formatDate(invoice.dueDate)}</td>
                      <td className="px-4 py-3 text-color-text">{formatEur(invoice.totalAmount)}</td>
                      <td className="px-4 py-3"><span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={getStatusTone(invoice.status)}>{invoice.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-color-card rounded-lg border border-color-border overflow-hidden">
            <div className="border-b border-color-border px-4 py-3 text-base font-semibold text-color-text">Payment History</div>
            {payments.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="min-w-[720px] w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-color-border bg-color-bg">
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Paid At</th>
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Invoice</th>
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Method</th>
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-color-text">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 text-color-text-muted">{formatDate(payment.paidAt)}</td>
                        <td className="px-4 py-3 text-color-text">{payment.invoiceNumber}</td>
                        <td className="px-4 py-3 text-color-text">{payment.method}</td>
                        <td className="px-4 py-3 text-color-text">{formatEur(payment.amount)}</td>
                        <td className="px-4 py-3 text-color-text-muted">{payment.reference || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-color-text-muted">No payments have been recorded yet.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-color-card rounded-lg border border-color-border p-6 max-w-lg">
          <p className="m-0 mb-4 text-color-text-muted">
            You do not have an active subscription yet. New restaurants receive a default onboarding plan automatically after approval.
          </p>
          <p className="m-0 text-sm text-color-text-muted">
            If your restaurant is already approved and no plan is showing yet, contact the platform administrator.
          </p>
        </div>
      )}

      {normalizedPlans.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-semibold mb-4 text-color-text">Available Plans</h3>
          <p className="text-color-text-muted text-sm mb-4">
            You can request a different plan based on your restaurant&apos;s needs. The new plan will become active after Super Admin approval.
          </p>
          <SubscriptionPlanRequestActions
            plans={normalizedPlans}
            currentPlanId={normalizedSubscription?.planId || null}
            pendingRequest={pendingPlanRequest}
          />
        </div>
      )}
    </div>
  );
}
