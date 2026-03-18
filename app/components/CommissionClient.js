"use client";

import Link from "next/link";
import { formatEur } from "@/lib/currencyFormat";
import { formatDate } from "@/lib/dateFormat";

function tone(status) {
  if (status === "PAID") return { background: "#dcfce7", color: "#166534" };
  if (status === "OPEN") return { background: "#fef3c7", color: "#b45309" };
  if (status === "OVERDUE") return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f1f5f9", color: "#64748b" };
}

export default function CommissionClient({ data, totals }) {
  const { plans = [], subscriptions = [], invoices = [] } = data || {};

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Commission & Billing</h2>
      <p className="text-color-text-muted text-sm mb-6">
        Review billed subscription revenue, invoice status, and payment collection across all restaurants.
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
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4 text-color-text">{plan.name}</td>
                    <td className="py-2 px-4 text-color-text">{formatEur(plan.monthlyPrice)}</td>
                    <td className="py-2 px-4 text-color-text">{plan.commissionPercent}%</td>
                    <td className="py-2 px-4 text-color-text-muted">{plan.trialDays}d / {plan.graceDays}d</td>
                  </tr>
                ))}
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
