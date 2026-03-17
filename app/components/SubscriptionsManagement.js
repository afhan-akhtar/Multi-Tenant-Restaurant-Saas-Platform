"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Eur = (n) =>
  `€${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function getStatusTone(status) {
  if (status === "ACTIVE") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (status === "EXPIRED") {
    return { background: "#fee2e2", color: "#991b1b" };
  }

  return { background: "#f1f5f9", color: "#64748b" };
}

function planToForm(plan) {
  if (!plan) {
    return {
      name: "",
      monthlyPrice: "",
      commissionPercent: "",
      features: "",
    };
  }

  return {
    name: plan.name || "",
    monthlyPrice: String(plan.monthlyPrice ?? ""),
    commissionPercent: String(plan.commissionPercent ?? ""),
    features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
  };
}

export default function SubscriptionsManagement({ plans, subscriptions, tenants, basePath = "" }) {
  const router = useRouter();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(planToForm(null));
  const [subForm, setSubForm] = useState({ tenantId: "", planId: "" });
  const [rowPlanSelection, setRowPlanSelection] = useState({});

  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === "ACTIVE");
  const tenantsWithoutSub = tenants.filter(
    (tenant) => !activeSubscriptions.some((subscription) => subscription.tenantId === tenant.id)
  );

  async function handleRequest(url, options, failureMessage) {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || failureMessage);
    }

    return data;
  }

  function openCreatePlanModal() {
    setEditingPlanId(null);
    setPlanForm(planToForm(null));
    setError("");
    setPlanModalOpen(true);
  }

  function openEditPlanModal(plan) {
    setEditingPlanId(plan.id);
    setPlanForm(planToForm(plan));
    setError("");
    setPlanModalOpen(true);
  }

  async function handleSavePlan(e) {
    e.preventDefault();
    setError("");
    setLoading("plan");

    try {
      const payload = {
        name: planForm.name.trim(),
        monthlyPrice: Number(planForm.monthlyPrice),
        commissionPercent: Number(planForm.commissionPercent),
        features: planForm.features,
      };

      await handleRequest(
        editingPlanId ? `/api/admin/plans/${editingPlanId}` : "/api/admin/plans",
        {
          method: editingPlanId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        editingPlanId ? "Failed to update plan" : "Failed to create plan"
      );

      setPlanModalOpen(false);
      setEditingPlanId(null);
      setPlanForm(planToForm(null));
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeletePlan(plan) {
    if (!window.confirm(`Delete "${plan.name}"?`)) {
      return;
    }

    setError("");
    setLoading(`delete-plan-${plan.id}`);

    try {
      await handleRequest(
        `/api/admin/plans/${plan.id}`,
        { method: "DELETE" },
        "Failed to delete plan"
      );
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleSeedDefaults() {
    setError("");
    setLoading("seed");

    try {
      await handleRequest(
        "/api/admin/plans/seed",
        { method: "POST" },
        "Failed to seed plans"
      );
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleAssignSubscription(e) {
    e.preventDefault();
    setError("");
    setLoading("sub");

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
      setSubForm({ tenantId: "", planId: "" });
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
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
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="py-4 w-full min-w-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h2 className="m-0 text-xl font-semibold text-color-text">
            Subscriptions & Plans
          </h2>
          <p className="m-0 mt-1 text-sm text-color-text-muted">
            Manage platform pricing, assign restaurants to plans, and control subscription status.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSeedDefaults}
            disabled={loading === "seed"}
            className="py-2 px-4 border border-color-border rounded-lg text-sm font-medium bg-white text-color-text disabled:opacity-70"
          >
            {loading === "seed" ? "Adding defaults…" : "Add Default Plans"}
          </button>
          <button
            type="button"
            onClick={openCreatePlanModal}
            className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0"
          >
            Add Plan
          </button>
          {tenantsWithoutSub.length > 0 && plans.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSubModalOpen(true);
                setError("");
                setSubForm({
                  tenantId: String(tenantsWithoutSub[0]?.id || ""),
                  planId: String(plans[0]?.id || ""),
                });
              }}
              className="py-2 px-4 bg-color-card border border-color-border rounded-lg text-sm font-medium text-color-text"
            >
              Assign to Restaurant
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-color-border bg-color-card p-4">
          <div className="text-sm text-color-text-muted">Total Plans</div>
          <div className="mt-1 text-2xl font-semibold text-color-text">{plans.length}</div>
        </div>
        <div className="rounded-xl border border-color-border bg-color-card p-4">
          <div className="text-sm text-color-text-muted">Active Subscriptions</div>
          <div className="mt-1 text-2xl font-semibold text-color-text">{activeSubscriptions.length}</div>
        </div>
        <div className="rounded-xl border border-color-border bg-color-card p-4">
          <div className="text-sm text-color-text-muted">Restaurants Without Plan</div>
          <div className="mt-1 text-2xl font-semibold text-color-text">{tenantsWithoutSub.length}</div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold m-0 text-color-text">Plans</h3>
          <span className="text-sm text-color-text-muted">
            {plans.length > 0 ? "Platform-defined pricing" : "No plans yet"}
          </span>
        </div>

        {plans.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-color-border bg-color-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-color-text">{plan.name}</div>
                    <div className="mt-1 text-2xl font-bold text-color-text">
                      {Eur(plan.monthlyPrice)}
                      <span className="ml-1 text-sm font-normal text-color-text-muted">/month</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {Number(plan.commissionPercent)}% commission
                  </span>
                </div>

                <div className="mt-4 text-sm text-color-text-muted">
                  {plan.subscriptionCount || 0} subscription(s) linked
                </div>

                {plan.features?.length > 0 && (
                  <ul className="mt-4 pl-5 text-sm text-color-text-muted space-y-1">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEditPlanModal(plan)}
                    className="py-2 px-3 rounded-lg border border-color-border text-sm font-medium text-color-text bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan)}
                    disabled={loading === `delete-plan-${plan.id}`}
                    className="py-2 px-3 rounded-lg border border-red-200 text-sm font-medium text-red-600 bg-white disabled:opacity-70"
                  >
                    {loading === `delete-plan-${plan.id}` ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem] rounded-xl border border-color-border bg-color-card">
            No plans defined yet. Use `Add Default Plans` to load recommended tiers.
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold m-0 text-color-text">Subscriptions</h3>
          <span className="text-sm text-color-text-muted">
            {subscriptions.length} total subscription record(s)
          </span>
        </div>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[900px]">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Restaurant</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Current Plan</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Billing</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Change Plan</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="py-3 px-4">
                      <div className="font-medium text-color-text">{subscription.tenant?.name}</div>
                      <div className="text-xs text-color-text-muted">
                        {subscription.tenant?.subdomain}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-color-text">{subscription.plan?.name}</div>
                      <div className="text-xs text-color-text-muted">
                        {Eur(subscription.plan?.monthlyPrice)} / {Number(subscription.plan?.commissionPercent || 0)}%
                      </div>
                    </td>
                    <td className="py-3 px-4 text-color-text-muted">
                      {formatDate(subscription.startDate)} – {formatDate(subscription.endDate)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                        style={getStatusTone(subscription.status)}
                      >
                        {subscription.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          className="min-w-[180px] py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                          value={rowPlanSelection[subscription.id] ?? String(subscription.planId)}
                          onChange={(e) =>
                            setRowPlanSelection((prev) => ({
                              ...prev,
                              [subscription.id]: e.target.value,
                            }))
                          }
                        >
                          {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} - {Eur(plan.monthlyPrice)}/mo
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            handleSubscriptionAction(subscription.id, "switch_plan", {
                              planId: Number(rowPlanSelection[subscription.id] ?? subscription.planId),
                            })
                          }
                          disabled={loading === `sub-${subscription.id}-switch_plan`}
                          className="py-2 px-3 rounded-lg border border-color-border bg-white text-sm font-medium text-color-text disabled:opacity-70"
                        >
                          Change
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSubscriptionAction(subscription.id, "renew")}
                          disabled={loading === `sub-${subscription.id}-renew`}
                          className="py-2 px-3 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-70"
                        >
                          Renew
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubscriptionAction(subscription.id, "expire")}
                          disabled={loading === `sub-${subscription.id}-expire`}
                          className="py-2 px-3 rounded-lg border border-amber-200 text-amber-700 bg-white text-sm font-medium disabled:opacity-70"
                        >
                          Mark Expired
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubscriptionAction(subscription.id, "cancel")}
                          disabled={loading === `sub-${subscription.id}-cancel`}
                          className="py-2 px-3 rounded-lg border border-red-200 text-red-600 bg-white text-sm font-medium disabled:opacity-70"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subscriptions.length === 0 && (
            <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">
              No subscriptions yet. Assign a plan to an active restaurant to get started.
            </div>
          )}
        </div>
      </div>

      {planModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-color-card rounded-xl shadow-xl border border-color-border p-6">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">
              {editingPlanId ? "Edit Subscription Plan" : "Add Subscription Plan"}
            </h3>
            <form onSubmit={handleSavePlan}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Plan name</label>
                <input
                  type="text"
                  required
                  placeholder="Growth"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm((form) => ({ ...form, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="mb-4 sm:mb-0">
                  <label className="block mb-1 text-sm font-medium text-color-text">
                    Monthly price (€)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="129"
                    className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                    value={planForm.monthlyPrice}
                    onChange={(e) =>
                      setPlanForm((form) => ({ ...form, monthlyPrice: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-color-text">
                    Commission %
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="4"
                    className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                    value={planForm.commissionPercent}
                    onChange={(e) =>
                      setPlanForm((form) => ({
                        ...form,
                        commissionPercent: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-color-text">
                  Features
                </label>
                <textarea
                  rows={6}
                  placeholder={`POS and split payments\nKDS\nAdvanced reports`}
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={planForm.features}
                  onChange={(e) =>
                    setPlanForm((form) => ({ ...form, features: e.target.value }))
                  }
                />
                <p className="mt-1 text-xs text-color-text-muted">
                  Add one feature per line. These are shown on admin and restaurant subscription screens.
                </p>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="py-2 px-4 border border-color-border rounded-lg text-color-text bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading === "plan"}
                  className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 disabled:opacity-70"
                >
                  {loading === "plan"
                    ? editingPlanId
                      ? "Saving…"
                      : "Creating…"
                    : editingPlanId
                      ? "Save Changes"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">
              Assign Plan to Restaurant
            </h3>
            <form onSubmit={handleAssignSubscription}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">
                  Restaurant
                </label>
                <select
                  required
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={subForm.tenantId}
                  onChange={(e) =>
                    setSubForm((form) => ({ ...form, tenantId: e.target.value }))
                  }
                >
                  <option value="">Select restaurant</option>
                  {tenantsWithoutSub.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.subdomain})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Plan</label>
                <select
                  required
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text"
                  value={subForm.planId}
                  onChange={(e) =>
                    setSubForm((form) => ({ ...form, planId: e.target.value }))
                  }
                >
                  <option value="">Select plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {Eur(plan.monthlyPrice)}/mo
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSubModalOpen(false)}
                  className="py-2 px-4 border border-color-border rounded-lg text-color-text bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading === "sub"}
                  className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 disabled:opacity-70"
                >
                  {loading === "sub" ? "Assigning…" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
