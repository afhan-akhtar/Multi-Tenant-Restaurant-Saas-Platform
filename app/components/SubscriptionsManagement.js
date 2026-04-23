"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatEur } from "@/lib/currencyFormat";
import { formatDate } from "@/lib/dateFormat";
import { SUBSCRIPTION_FEATURE_CATALOG } from "@/lib/subscriptionPlans";

const PAYMENT_METHODS = ["MANUAL", "STRIPE", "CARD", "CASH"];

function getStatusTone(status) {
  if (status === "ACTIVE" || status === "PAID") return { background: "#dcfce7", color: "#166534" };
  if (status === "TRIALING") return { background: "#dbeafe", color: "#1d4ed8" };
  if (status === "GRACE_PERIOD" || status === "OPEN") return { background: "#fef3c7", color: "#b45309" };
  if (status === "PAST_DUE" || status === "OVERDUE") return { background: "#fde68a", color: "#92400e" };
  if (status === "EXPIRED") return { background: "#fee2e2", color: "#991b1b" };
  if (status === "CANCELLED") return { background: "#e5e7eb", color: "#374151" };
  return { background: "#f1f5f9", color: "#64748b" };
}

function planToForm(plan) {
  const feats = plan?.features;
  const rawFeat = feats && typeof feats === "object" && !Array.isArray(feats) ? feats : {};
  const isFlat = String(rawFeat.commissionModel || "").toUpperCase() === "FLAT_PER_ORDER";
  return {
    code: plan?.code || "",
    name: plan?.name || "",
    description: plan?.description || "",
    monthlyPrice: String(plan?.monthlyPrice ?? ""),
    commissionPercent: String(plan?.commissionPercent ?? ""),
    commissionModel: isFlat ? "FLAT_PER_ORDER" : "REVENUE_PERCENT",
    flatFeePerOrder: String(rawFeat.flatFeePerOrder ?? rawFeat.flatFee ?? ""),
    trialDays: String(plan?.trialDays ?? 14),
    graceDays: String(plan?.graceDays ?? 7),
    sortOrder: String(plan?.sortOrder ?? 0),
    featureCodes: Array.isArray(plan?.features?.codes) ? plan.features.codes : [],
  };
}

function paymentToForm(invoice) {
  return {
    invoiceId: String(invoice?.id || ""),
    amount: String(invoice?.totalAmount ?? ""),
    method: "MANUAL",
    reference: "",
  };
}

export default function SubscriptionsManagement({ plans, subscriptions, tenants, planChangeRequests = [] }) {
  const router = useRouter();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingPaymentSubId, setEditingPaymentSubId] = useState(null);
  const [planForm, setPlanForm] = useState(planToForm(null));
  const [subForm, setSubForm] = useState({ tenantId: "", planId: "" });
  const [paymentForm, setPaymentForm] = useState(paymentToForm(null));
  const [rowPlanSelection, setRowPlanSelection] = useState({});

  const activeStatuses = ["TRIALING", "ACTIVE", "GRACE_PERIOD", "PAST_DUE"];
  const activeSubscriptions = subscriptions.filter((subscription) => activeStatuses.includes(subscription.status));
  const tenantsWithoutSub = tenants.filter(
    (tenant) => !activeSubscriptions.some((subscription) => subscription.tenantId === tenant.id)
  );

  const recentInvoices = useMemo(
    () =>
      subscriptions
        .flatMap((subscription) =>
          (subscription.invoices || []).map((invoice) => ({
            ...invoice,
            subscriptionId: subscription.id,
            tenantName: subscription.tenant?.name || "Restaurant",
            planName: subscription.plan?.name || "",
          }))
        )
        .sort((a, b) => new Date(b.issuedAt || 0) - new Date(a.issuedAt || 0))
        .slice(0, 8),
    [subscriptions]
  );

  async function handleRequest(url, options, failureMessage) {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || failureMessage);
    return data;
  }

  async function handleSubscriptionAction(subscriptionId, action, extra = {}) {
    setError("");
    setLoading(`sub-${subscriptionId}-${action}`);
    try {
      await handleRequest(
        `/api/admin/subscriptions/${subscriptionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...extra }),
        },
        "Failed to update subscription"
      );
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(null);
    }
  }

  function toggleFeature(code) {
    setPlanForm((form) => ({
      ...form,
      featureCodes: form.featureCodes.includes(code)
        ? form.featureCodes.filter((value) => value !== code)
        : [...form.featureCodes, code],
    }));
  }

  async function savePlan(e) {
    e.preventDefault();
    setError("");
    if (planForm.commissionModel === "FLAT_PER_ORDER") {
      const flat = Number(planForm.flatFeePerOrder);
      if (!Number.isFinite(flat) || flat < 0) {
        setError("Enter a valid flat fee per order.");
        return;
      }
    }
    setLoading("plan");
    try {
      await handleRequest(
        editingPlanId ? `/api/admin/plans/${editingPlanId}` : "/api/admin/plans",
        {
          method: editingPlanId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: planForm.code,
            name: planForm.name,
            description: planForm.description,
            monthlyPrice: Number(planForm.monthlyPrice),
            commissionPercent: Number(planForm.commissionPercent),
            trialDays: Number(planForm.trialDays),
            graceDays: Number(planForm.graceDays),
            sortOrder: Number(planForm.sortOrder || 0),
            featureCodes: planForm.featureCodes,
            commissionModel: planForm.commissionModel,
            flatFeePerOrder: planForm.commissionModel === "FLAT_PER_ORDER" ? planForm.flatFeePerOrder : "",
          }),
        },
        editingPlanId ? "Failed to update plan" : "Failed to create plan"
      );
      setPlanModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function deletePlan(plan) {
    if (!window.confirm(`Delete "${plan.name}"?`)) return;
    setError("");
    setLoading(`delete-plan-${plan.id}`);
    try {
      await handleRequest(`/api/admin/plans/${plan.id}`, { method: "DELETE" }, "Failed to delete plan");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function seedPlans() {
    setLoading("seed");
    setError("");
    try {
      await handleRequest("/api/admin/plans/seed", { method: "POST" }, "Failed to seed plans");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function runBillingCycle() {
    setLoading("billing-cycle");
    setError("");
    try {
      await handleRequest("/api/admin/subscriptions/billing", { method: "POST" }, "Failed to run billing cycle");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function assignSubscription(e) {
    e.preventDefault();
    setLoading("sub");
    setError("");
    try {
      await handleRequest(
        "/api/admin/subscriptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId: Number(subForm.tenantId),
            planId: Number(subForm.planId),
          }),
        },
        "Failed to assign subscription"
      );
      setSubModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function recordPayment(e) {
    e.preventDefault();
    if (!editingPaymentSubId) return;
    try {
      await handleSubscriptionAction(editingPaymentSubId, "record_payment", {
        invoiceId: Number(paymentForm.invoiceId),
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        reference: paymentForm.reference,
      });
      setPaymentModalOpen(false);
    } catch {
      // Error handled centrally.
    }
  }

  async function handlePlanChangeRequestAction(requestId, action) {
    setError("");
    setLoading(`request-${requestId}-${action}`);
    try {
      await handleRequest(
        `/api/admin/subscription-requests/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        },
        "Failed to update plan change request"
      );
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="py-4 w-full min-w-0">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="m-0 text-xl font-semibold text-color-text">Subscription & Feature Control</h2>
          <p className="m-0 mt-1 text-sm text-color-text-muted">
            Manage subscription plans, feature flags, invoices, and payment collection.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={seedPlans} disabled={loading === "seed"} className="rounded-lg border border-color-border bg-white px-4 py-2 text-sm font-medium text-color-text disabled:opacity-70">
            {loading === "seed" ? "Adding defaults…" : "Seed Defaults"}
          </button>
          <button type="button" onClick={runBillingCycle} disabled={loading === "billing-cycle"} className="rounded-lg border border-color-border bg-white px-4 py-2 text-sm font-medium text-color-text disabled:opacity-70">
            {loading === "billing-cycle" ? "Processing…" : "Run Billing Cycle"}
          </button>
          <button type="button" onClick={() => { setEditingPlanId(null); setPlanForm(planToForm(null)); setPlanModalOpen(true); }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
            Add Plan
          </button>
          {tenantsWithoutSub.length > 0 && plans.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSubForm({ tenantId: String(tenantsWithoutSub[0]?.id || ""), planId: String(plans[0]?.id || "") });
                setSubModalOpen(true);
              }}
              className="rounded-lg border border-color-border bg-color-card px-4 py-2 text-sm font-medium text-color-text"
            >
              Assign to Restaurant
            </button>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-color-border bg-color-card p-4"><div className="text-sm text-color-text-muted">Total Plans</div><div className="mt-1 text-2xl font-semibold text-color-text">{plans.length}</div></div>
        <div className="rounded-xl border border-color-border bg-color-card p-4"><div className="text-sm text-color-text-muted">Billable Subscriptions</div><div className="mt-1 text-2xl font-semibold text-color-text">{activeSubscriptions.length}</div></div>
        <div className="rounded-xl border border-color-border bg-color-card p-4"><div className="text-sm text-color-text-muted">Recent Invoices</div><div className="mt-1 text-2xl font-semibold text-color-text">{recentInvoices.length}</div></div>
        <div className="rounded-xl border border-color-border bg-color-card p-4"><div className="text-sm text-color-text-muted">Pending Plan Requests</div><div className="mt-1 text-2xl font-semibold text-color-text">{planChangeRequests.filter((request) => request.status === "PENDING").length}</div></div>
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-base font-semibold text-color-text">Plans</h3>
          <span className="text-sm text-color-text-muted">Commercial configuration and feature flags</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-color-border bg-color-card p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-color-text-muted">{plan.code}</div>
              <div className="mt-1 text-lg font-semibold text-color-text">{plan.name}</div>
              {plan.description && <p className="mt-1 text-sm text-color-text-muted">{plan.description}</p>}
              <div className="mt-3 text-2xl font-bold text-color-text">{formatEur(plan.monthlyPrice)}<span className="ml-1 text-sm font-normal text-color-text-muted">/month</span></div>
              <div className="mt-2 text-sm text-color-text-muted">{Number(plan.commissionPercent)}% commission • trial {plan.trialDays}d • grace {plan.graceDays}d</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(plan.features?.items || []).map((feature) => (
                  <span key={`${plan.id}-${feature}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{feature}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => { setEditingPlanId(plan.id); setPlanForm(planToForm(plan)); setPlanModalOpen(true); }} className="rounded-lg border border-color-border bg-white px-3 py-2 text-sm font-medium text-color-text">Edit</button>
                <button type="button" onClick={() => deletePlan(plan)} disabled={loading === `delete-plan-${plan.id}`} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-70">{loading === `delete-plan-${plan.id}` ? "Deleting…" : "Delete"}</button>
              </div>
            </div>
          ))}
          {plans.length === 0 && <div className="rounded-xl border border-color-border bg-color-card px-6 py-8 text-center text-color-text-muted">No plans defined yet.</div>}
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border border-color-border bg-color-card shadow-sm">
        <div className="border-b border-color-border bg-color-bg px-4 py-3 text-base font-semibold text-color-text">Plan Change Requests</div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-color-border bg-color-bg">
                <th className="px-4 py-3 text-left font-semibold text-color-text">Restaurant</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Current Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Requested Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Message</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {planChangeRequests.map((request) => (
                <tr key={request.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-color-text">{request.tenant?.name}</div>
                    <div className="text-xs text-color-text-muted">{request.tenant?.subdomain}</div>
                  </td>
                  <td className="px-4 py-3 text-color-text">{request.currentPlan?.name || "No active plan"}</td>
                  <td className="px-4 py-3 text-color-text">{request.requestedPlan?.name}</td>
                  <td className="px-4 py-3 text-color-text-muted">{request.message || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={getStatusTone(request.status)}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {request.status === "PENDING" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlanChangeRequestAction(request.id, "approve")}
                          disabled={loading === `request-${request.id}-approve`}
                          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlanChangeRequestAction(request.id, "reject")}
                          disabled={loading === `request-${request.id}-reject`}
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-70"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-color-text-muted">Reviewed {formatDate(request.reviewedAt)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {planChangeRequests.length === 0 && (
          <div className="px-6 py-8 text-center text-color-text-muted">No plan change requests yet.</div>
        )}
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border border-color-border bg-color-card shadow-sm">
        <div className="border-b border-color-border bg-color-bg px-4 py-3 text-base font-semibold text-color-text">Subscriptions</div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-color-border bg-color-bg">
                <th className="px-4 py-3 text-left font-semibold text-color-text">Restaurant</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Lifecycle</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Latest Invoice</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Change Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => {
                const latestInvoice = subscription.invoices?.[0] || null;
                return (
                  <tr key={subscription.id} className="align-top border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3"><div className="font-medium text-color-text">{subscription.tenant?.name}</div><div className="text-xs text-color-text-muted">{subscription.tenant?.subdomain}</div></td>
                    <td className="px-4 py-3"><div className="font-medium text-color-text">{subscription.plan?.name}</div><div className="text-xs text-color-text-muted">{formatEur(subscription.plan?.monthlyPrice)} / {Number(subscription.plan?.commissionPercent || 0)}%</div></td>
                    <td className="px-4 py-3 text-color-text-muted">
                      <div className="mb-2"><span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={getStatusTone(subscription.status)}>{subscription.status}</span></div>
                      <div>{formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}</div>
                      <div className="mt-1 text-xs">Trial ends: {formatDate(subscription.trialEndDate)} • Grace ends: {formatDate(subscription.gracePeriodEndsAt)}</div>
                    </td>
                    <td className="px-4 py-3">
                      {latestInvoice ? (
                        <div className="space-y-1 text-sm">
                          <div className="font-medium text-color-text">{latestInvoice.invoiceNumber}</div>
                          <div className="text-color-text-muted">{formatEur(latestInvoice.totalAmount)} due {formatDate(latestInvoice.dueDate)}</div>
                          <span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={getStatusTone(latestInvoice.status)}>{latestInvoice.status}</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Link href={`/invoice/${latestInvoice.id}`} className="text-xs font-medium text-primary no-underline">View invoice</Link>
                            {latestInvoice.status !== "PAID" && (
                              <button type="button" onClick={() => { setEditingPaymentSubId(subscription.id); setPaymentForm(paymentToForm(latestInvoice)); setPaymentModalOpen(true); }} className="text-xs font-medium text-primary">Record payment</button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-color-text-muted">No invoice yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select className="min-w-[180px] rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={rowPlanSelection[subscription.id] ?? String(subscription.planId)} onChange={(e) => setRowPlanSelection((prev) => ({ ...prev, [subscription.id]: e.target.value }))}>
                          {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} - {formatEur(plan.monthlyPrice)}/mo</option>)}
                        </select>
                        <button type="button" onClick={() => handleSubscriptionAction(subscription.id, "switch_plan", { planId: Number(rowPlanSelection[subscription.id] ?? subscription.planId) })} disabled={loading === `sub-${subscription.id}-switch_plan`} className="rounded-lg border border-color-border bg-white px-3 py-2 text-sm font-medium text-color-text disabled:opacity-70">Change</button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleSubscriptionAction(subscription.id, "renew")} disabled={loading === `sub-${subscription.id}-renew`} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-70">Renew</button>
                        <button type="button" onClick={() => handleSubscriptionAction(subscription.id, "generate_invoice")} disabled={loading === `sub-${subscription.id}-generate_invoice`} className="rounded-lg border border-color-border bg-white px-3 py-2 text-sm font-medium text-color-text disabled:opacity-70">Invoice</button>
                        <button type="button" onClick={() => handleSubscriptionAction(subscription.id, "cancel_at_period_end")} disabled={loading === `sub-${subscription.id}-cancel_at_period_end`} className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-700 disabled:opacity-70">End of Period</button>
                        <button type="button" onClick={() => handleSubscriptionAction(subscription.id, "expire")} disabled={loading === `sub-${subscription.id}-expire`} className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-700 disabled:opacity-70">Expire</button>
                        <button type="button" onClick={() => handleSubscriptionAction(subscription.id, "cancel")} disabled={loading === `sub-${subscription.id}-cancel`} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-70">Cancel</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {subscriptions.length === 0 && <div className="px-6 py-8 text-center text-color-text-muted">No subscriptions yet.</div>}
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border border-color-border bg-color-card shadow-sm">
        <div className="border-b border-color-border bg-color-bg px-4 py-3 text-base font-semibold text-color-text">Recent Invoices</div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-color-border bg-color-bg">
                <th className="px-4 py-3 text-left font-semibold text-color-text">Invoice</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Restaurant</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-color-text">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3"><Link href={`/invoice/${invoice.id}`} className="font-medium text-primary no-underline">{invoice.invoiceNumber}</Link></td>
                  <td className="px-4 py-3 text-color-text">{invoice.tenantName}</td>
                  <td className="px-4 py-3 text-color-text">{invoice.planName}</td>
                  <td className="px-4 py-3 text-color-text">{formatEur(invoice.totalAmount)}</td>
                  <td className="px-4 py-3"><span className="inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={getStatusTone(invoice.status)}>{invoice.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentInvoices.length === 0 && <div className="px-6 py-8 text-center text-color-text-muted">No invoices generated yet.</div>}
      </div>

      {planModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-color-border bg-color-card p-6 shadow-xl">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">{editingPlanId ? "Edit Subscription Plan" : "Add Subscription Plan"}</h3>
            <form onSubmit={savePlan}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm font-medium text-color-text">Plan code</label><input type="text" required className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.code} onChange={(e) => setPlanForm((form) => ({ ...form, code: e.target.value }))} /></div>
                <div><label className="mb-1 block text-sm font-medium text-color-text">Plan name</label><input type="text" required className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.name} onChange={(e) => setPlanForm((form) => ({ ...form, name: e.target.value }))} /></div>
              </div>
              <div className="mt-4"><label className="mb-1 block text-sm font-medium text-color-text">Description</label><textarea rows={3} className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.description} onChange={(e) => setPlanForm((form) => ({ ...form, description: e.target.value }))} /></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm font-medium text-color-text">Commission model</label><select className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.commissionModel} onChange={(e) => setPlanForm((form) => ({ ...form, commissionModel: e.target.value }))}><option value="REVENUE_PERCENT">% of completed-order revenue</option><option value="FLAT_PER_ORDER">Flat fee per completed order</option></select></div>
                {planForm.commissionModel === "FLAT_PER_ORDER" ? (
                  <div><label className="mb-1 block text-sm font-medium text-color-text">Flat fee (EUR / order)</label><input type="number" required min="0" step="0.01" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.flatFeePerOrder} onChange={(e) => setPlanForm((form) => ({ ...form, flatFeePerOrder: e.target.value }))} /></div>
                ) : (
                  <div><label className="mb-1 block text-sm font-medium text-color-text">Commission %</label><input type="number" required min="0" max="100" step="0.1" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.commissionPercent} onChange={(e) => setPlanForm((form) => ({ ...form, commissionPercent: e.target.value }))} /></div>
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1 block text-sm font-medium text-color-text">Monthly price</label><input type="number" required min="0" step="0.01" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.monthlyPrice} onChange={(e) => setPlanForm((form) => ({ ...form, monthlyPrice: e.target.value }))} /></div>
                <div><label className="mb-1 block text-sm font-medium text-color-text">Trial days</label><input type="number" min="0" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.trialDays} onChange={(e) => setPlanForm((form) => ({ ...form, trialDays: e.target.value }))} /></div>
                <div><label className="mb-1 block text-sm font-medium text-color-text">Grace days</label><input type="number" min="0" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.graceDays} onChange={(e) => setPlanForm((form) => ({ ...form, graceDays: e.target.value }))} /></div>
              </div>
              <div className="mt-4"><label className="mb-1 block text-sm font-medium text-color-text">Display order</label><input type="number" min="0" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={planForm.sortOrder} onChange={(e) => setPlanForm((form) => ({ ...form, sortOrder: e.target.value }))} /></div>
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-color-text">Feature flags</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUBSCRIPTION_FEATURE_CATALOG.map((feature) => (
                    <label key={feature.code} className={`rounded-xl border p-3 ${planForm.featureCodes.includes(feature.code) ? "border-primary bg-primary/5" : "border-color-border bg-color-bg"}`}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={planForm.featureCodes.includes(feature.code)} onChange={() => toggleFeature(feature.code)} className="mt-1" />
                        <div><div className="font-medium text-color-text">{feature.label}</div><div className="text-xs text-color-text-muted">{feature.description}</div></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setPlanModalOpen(false)} className="rounded-lg border border-color-border bg-transparent px-4 py-2 text-color-text">Cancel</button>
                <button type="submit" disabled={loading === "plan"} className="rounded-lg bg-primary px-4 py-2 font-medium text-white disabled:opacity-70">{loading === "plan" ? "Saving…" : editingPlanId ? "Save Changes" : "Create Plan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-color-border bg-color-card p-6 shadow-xl">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Assign Plan to Restaurant</h3>
            <form onSubmit={assignSubscription}>
              <div className="mb-4"><label className="mb-1 block text-sm font-medium text-color-text">Restaurant</label><select required className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={subForm.tenantId} onChange={(e) => setSubForm((form) => ({ ...form, tenantId: e.target.value }))}><option value="">Select restaurant</option>{tenantsWithoutSub.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.name} ({tenant.subdomain})</option>)}</select></div>
              <div className="mb-4"><label className="mb-1 block text-sm font-medium text-color-text">Plan</label><select required className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={subForm.planId} onChange={(e) => setSubForm((form) => ({ ...form, planId: e.target.value }))}><option value="">Select plan</option>{plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} - {formatEur(plan.monthlyPrice)}/mo</option>)}</select></div>
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setSubModalOpen(false)} className="rounded-lg border border-color-border bg-transparent px-4 py-2 text-color-text">Cancel</button><button type="submit" disabled={loading === "sub"} className="rounded-lg bg-primary px-4 py-2 font-medium text-white disabled:opacity-70">{loading === "sub" ? "Assigning…" : "Assign"}</button></div>
            </form>
          </div>
        </div>
      )}

      {paymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-color-border bg-color-card p-6 shadow-xl">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Record Invoice Payment</h3>
            <form onSubmit={recordPayment}>
              <div className="mb-4"><label className="mb-1 block text-sm font-medium text-color-text">Amount</label><input type="number" required min="0" step="0.01" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={paymentForm.amount} onChange={(e) => setPaymentForm((form) => ({ ...form, amount: e.target.value }))} /></div>
              <div className="mb-4"><label className="mb-1 block text-sm font-medium text-color-text">Method</label><select className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={paymentForm.method} onChange={(e) => setPaymentForm((form) => ({ ...form, method: e.target.value }))}>{PAYMENT_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}</select></div>
              <div className="mb-4"><label className="mb-1 block text-sm font-medium text-color-text">Reference</label><input type="text" className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text" value={paymentForm.reference} onChange={(e) => setPaymentForm((form) => ({ ...form, reference: e.target.value }))} /></div>
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setPaymentModalOpen(false)} className="rounded-lg border border-color-border bg-transparent px-4 py-2 text-color-text">Cancel</button><button type="submit" disabled={loading === `sub-${editingPaymentSubId}-record_payment`} className="rounded-lg bg-primary px-4 py-2 font-medium text-white disabled:opacity-70">{loading === `sub-${editingPaymentSubId}-record_payment` ? "Saving…" : "Record Payment"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
