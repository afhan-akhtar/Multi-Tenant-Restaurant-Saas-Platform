"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatEur } from "@/lib/currencyFormat";

export default function SubscriptionPlanRequestActions({
  plans,
  currentPlanId,
  pendingRequest = null,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  async function submitRequest(planId) {
    setError("");
    setLoading(planId);
    try {
      const response = await fetch("/api/subscription/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlanId: planId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit plan change request.");
      }

      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {pendingRequest && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Pending request for <strong>{pendingRequest.requestedPlan?.name}</strong>. The new plan will activate after
          Super Admin approval.
        </div>
      )}

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.id;
          const isPendingPlan = pendingRequest?.requestedPlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-lg border p-4 ${
                isCurrentPlan ? "border-primary bg-primary/5" : "border-color-border bg-color-card"
              }`}
            >
              <div className="font-semibold text-color-text">{plan.name}</div>
              {plan.description && <div className="mt-1 text-sm text-color-text-muted">{plan.description}</div>}
              <div className="mt-2 text-lg font-bold text-color-text">
                {formatEur(plan.monthlyPrice)}
                <span className="text-sm font-normal text-color-text-muted">/mo</span>
              </div>
              <div className="mt-1 text-sm text-color-text-muted">{Number(plan.commissionPercent)}% commission</div>
              <div className="mt-1 text-xs text-color-text-muted">
                Trial {plan.trialDays} days • Grace {plan.graceDays} days
              </div>
              {plan.features?.items?.length > 0 && (
                <ul className="mt-3 space-y-1 pl-5 text-sm text-color-text-muted">
                  {plan.features.items.map((feature) => (
                    <li key={`${plan.id}-${feature}`}>{feature}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                {isCurrentPlan ? (
                  <span className="inline-block rounded bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                    Current plan
                  </span>
                ) : isPendingPlan ? (
                  <span className="inline-block rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                    Request pending
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => submitRequest(plan.id)}
                    disabled={Boolean(pendingRequest) || loading === plan.id}
                    className="rounded-lg border border-color-border bg-white px-3 py-2 text-sm font-medium text-color-text disabled:opacity-70"
                  >
                    {loading === plan.id ? "Submitting..." : "Request this plan"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
