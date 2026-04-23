"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatEur } from "@/lib/currencyFormat";
import { formatDate } from "@/lib/dateFormat";
import { computeCommissionOwed, getPlanCommissionMeta } from "@/lib/commission-calc";

function tone(status) {
  if (status === "PAID") return { background: "#dcfce7", color: "#166534" };
  if (status === "OPEN") return { background: "#fef3c7", color: "#b45309" };
  if (status === "OVERDUE") return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f1f5f9", color: "#64748b" };
}

const ACTIVE_SUB = ["TRIALING", "ACTIVE", "GRACE_PERIOD", "PAST_DUE"];

export default function CommissionClient({ data, totals }) {
  const { plans = [], subscriptions = [], invoices = [], revenueByTenant = {} } = data || {};

  const reconciliation = useMemo(() => {
    return subscriptions
      .filter((s) => ACTIVE_SUB.includes(s.status))
      .map((s) => {
        const tid = s.tenantId;
        const rev = revenueByTenant[tid]?.revenue ?? 0;
        const orderCount = revenueByTenant[tid]?.orderCount ?? 0;
        const plan = s.plan;
        const meta = getPlanCommissionMeta(plan);
        const commissionOwed = computeCommissionOwed(meta, rev, orderCount);
        return {
          tenantId: tid,
          tenantName: s.tenant?.name || "—",
          subdomain: s.tenant?.subdomain || "",
          planName: plan?.name || "—",
          modelDetail:
            meta.model === "FLAT_PER_ORDER"
              ? `${formatEur(meta.flatFeePerOrder)} × ${orderCount} orders`
              : `${meta.percent}% × ${formatEur(rev)}`,
          completedOrderRevenue: rev,
          orderCount,
          commissionOwed,
        };
      });
  }, [subscriptions, revenueByTenant]);

  const reconciliationTotal = useMemo(
    () => reconciliation.reduce((sum, row) => sum + row.commissionOwed, 0),
    [reconciliation]
  );

  function exportReconciliationCsv() {
    const header = [
      "tenant_id",
      "restaurant",
      "subdomain",
      "plan",
      "model",
      "completed_order_revenue",
      "order_count",
      "commission_owed",
    ];
    const lines = [
      header.join(","),
      ...reconciliation.map((r) =>
        [
          r.tenantId,
          `"${String(r.tenantName).replace(/"/g, '""')}"`,
          r.subdomain,
          `"${String(r.planName).replace(/"/g, '""')}"`,
          r.modelLabel,
          r.completedOrderRevenue.toFixed(2),
          r.orderCount,
          r.commissionOwed.toFixed(2),
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commission-reconciliation-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Commission & Billing</h2>
      <p className="text-color-text-muted text-sm mb-6">
        Subscription invoices and payments below; commission reconciliation uses each tenant&apos;s completed-order
        revenue (or flat fee × order count) from the plan configuration in Subscriptions &amp; Plans.
      </p>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg bg-color-card border border-color-border"><p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Invoiced Revenue</p><p className="m-0 mt-1 text-xl font-semibold text-color-text">{formatEur(totals.revenue)}</p></div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border"><p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Payments Received</p><p className="m-0 mt-1 text-xl font-semibold text-color-text">{formatEur(totals.paid)}</p></div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border"><p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Outstanding</p><p className="m-0 mt-1 text-xl font-semibold text-color-text">{formatEur(totals.outstanding)}</p></div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border"><p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Subscriptions</p><p className="m-0 mt-1 text-xl font-semibold text-color-text">{subscriptions.length}</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Plans & Rates</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Plan</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Monthly</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Commission</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Trial / Grace</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const meta = getPlanCommissionMeta(plan);
                  const commLabel =
                    meta.model === "FLAT_PER_ORDER" && meta.flatFeePerOrder > 0
                      ? `${formatEur(meta.flatFeePerOrder)} / order`
                      : `${plan.commissionPercent}% of revenue`;
                  return (
                    <tr key={plan.id} className="border-b border-color-border last:border-0">
                      <td className="py-2 px-4 text-color-text">{plan.name}</td>
                      <td className="py-2 px-4 text-color-text">{formatEur(plan.monthlyPrice)}</td>
                      <td className="py-2 px-4 text-color-text">{commLabel}</td>
                      <td className="py-2 px-4 text-color-text-muted">{plan.trialDays}d / {plan.graceDays}d</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Subscription Status</h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Restaurant</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Plan</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Status</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Period End</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4 text-color-text">{subscription.tenant?.name}</td>
                    <td className="py-2 px-4 text-color-text">{subscription.plan?.name}</td>
                    <td className="py-2 px-4"><span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={tone(subscription.status)}>{subscription.status}</span></td>
                    <td className="py-2 px-4 text-color-text-muted">{formatDate(subscription.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 border-b border-color-border">
          <div>
            <h3 className="m-0 text-base font-semibold text-color-text">Monthly commission reconciliation</h3>
            <p className="m-0 mt-1 text-xs text-color-text-muted">
              Totals owed from operational data (export for accounting). Platform subscription invoices are listed below separately.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-color-text">{formatEur(reconciliationTotal)}</span>
            <button
              type="button"
              onClick={exportReconciliationCsv}
              disabled={reconciliation.length === 0}
              className="py-2 px-3 rounded-lg border border-color-border bg-color-bg text-sm font-medium text-color-text cursor-pointer hover:bg-color-card disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[720px]">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-2 px-4 text-left font-semibold text-color-text">Restaurant</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Plan</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Model</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Orders</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Completed revenue</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Commission owed</th>
              </tr>
            </thead>
            <tbody>
              {reconciliation.map((r) => (
                <tr key={r.tenantId} className="border-b border-color-border last:border-0">
                  <td className="py-2 px-4 text-color-text">{r.tenantName}</td>
                  <td className="py-2 px-4 text-color-text">{r.planName}</td>
                  <td className="py-2 px-4 text-color-text-muted text-xs">{r.modelDetail}</td>
                  <td className="py-2 px-4 text-color-text">{r.orderCount}</td>
                  <td className="py-2 px-4 text-color-text">{formatEur(r.completedOrderRevenue)}</td>
                  <td className="py-2 px-4 text-color-text font-medium">{formatEur(r.commissionOwed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reconciliation.length === 0 && (
          <div className="py-8 text-center text-color-text-muted text-sm">No active subscriptions to reconcile.</div>
        )}
      </div>

      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">Invoices & Payments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-2 px-4 text-left font-semibold text-color-text">Invoice</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Restaurant</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Plan</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Issued</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Due</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Amount</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Paid</th>
                <th className="py-2 px-4 text-left font-semibold text-color-text">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const paidAmount = (invoice.payments || []).reduce((sum, payment) => sum + payment.amount, 0);
                return (
                  <tr key={invoice.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4"><Link href={`/invoice/${invoice.id}`} className="font-medium text-primary no-underline">{invoice.invoiceNumber}</Link></td>
                    <td className="py-2 px-4 text-color-text">{invoice.tenantName}</td>
                    <td className="py-2 px-4 text-color-text">{invoice.planName}</td>
                    <td className="py-2 px-4 text-color-text-muted">{formatDate(invoice.issuedAt)}</td>
                    <td className="py-2 px-4 text-color-text-muted">{formatDate(invoice.dueDate)}</td>
                    <td className="py-2 px-4 text-color-text">{formatEur(invoice.totalAmount)}</td>
                    <td className="py-2 px-4 text-color-text">{formatEur(paidAmount)}</td>
                    <td className="py-2 px-4"><span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={tone(invoice.status)}>{invoice.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {invoices.length === 0 && (
          <div className="py-8 text-center text-color-text-muted text-sm">No invoices generated yet.</div>
        )}
      </div>
    </div>
  );
}
