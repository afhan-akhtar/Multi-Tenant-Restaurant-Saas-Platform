import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Eur = (n) => `€${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

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

  const [subscription, plans] = await Promise.all([
    prisma.tenantSubscription.findFirst({
      where: { tenantId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.subscriptionPlan.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">My Subscription</h2>

      {subscription ? (
        <div className="space-y-6">
          <div className="bg-color-card rounded-lg border border-color-border p-6 max-w-lg">
            <h3 className="m-0 mb-4 text-base font-semibold text-color-text">Current Plan</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-color-text-muted">Plan</span>
                <span className="font-medium text-color-text">{subscription.plan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-color-text-muted">Monthly price</span>
                <span className="font-medium text-color-text">{Eur(subscription.plan?.monthlyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-color-text-muted">Commission rate</span>
                <span className="font-medium text-color-text">{Number(subscription.plan?.commissionPercent)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-color-text-muted">Status</span>
                <span
                  className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  {subscription.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-color-text-muted">Billing period</span>
                <span className="font-medium text-color-text">
                  {new Date(subscription.startDate).toLocaleDateString()} – {new Date(subscription.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="mt-6 text-color-text-muted text-xs">
              Commission is calculated from your completed orders. To change plans or for billing questions, contact the platform administrator.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-color-card rounded-lg border border-color-border p-6 max-w-lg">
          <p className="m-0 mb-4 text-color-text-muted">
            You do not have an active subscription yet. The platform administrator will assign a plan to your restaurant after approval.
          </p>
          <p className="m-0 text-sm text-color-text-muted">
            Contact support if your restaurant is already approved and you need a plan assigned.
          </p>
        </div>
      )}

      {plans.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-semibold mb-4 text-color-text">Available Plans</h3>
          <p className="text-color-text-muted text-sm mb-4">
            Plans and pricing are defined by the platform. Your current plan is assigned by the administrator.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-lg border ${subscription?.planId === p.id ? "border-primary bg-primary/5" : "border-color-border bg-color-card"}`}
              >
                <div className="font-semibold text-color-text">{p.name}</div>
                <div className="mt-1 text-lg font-bold text-color-text">{Eur(p.monthlyPrice)}<span className="text-sm font-normal text-color-text-muted">/mo</span></div>
                <div className="mt-1 text-sm text-color-text-muted">{Number(p.commissionPercent)}% commission on orders</div>
                {subscription?.planId === p.id && (
                  <span className="inline-block mt-2 py-0.5 px-2 rounded text-xs font-medium bg-primary/20 text-primary">
                    Your plan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
