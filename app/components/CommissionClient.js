"use client";

const Eur = (n) => `€${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

export default function CommissionClient({ data, totals }) {
  const { plans, subscriptions } = data;

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Commission & Billing</h2>
      <p className="text-color-text-muted text-sm mb-6">
        Commission is calculated from order revenue based on each restaurant&apos;s subscription plan rate.
      </p>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Platform Revenue</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{Eur(totals.revenue)}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Commission Earned</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{Eur(totals.commission)}</p>
        </div>
        <div className="p-4 rounded-lg bg-color-card border border-color-border">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-color-text-muted">Active Subscriptions</p>
          <p className="m-0 mt-1 text-xl font-semibold text-color-text">{subscriptions.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">
            Plans & Commission Rates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Plan</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text" data-align="right">Monthly</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text" data-align="right">Commission %</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text" data-align="right">Subscriptions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-b border-color-border last:border-0">
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4" data-align="right">{Eur(p.monthlyPrice)}</td>
                    <td className="py-2 px-4" data-align="right">{p.commissionPercent}%</td>
                    <td className="py-2 px-4" data-align="right">{p.subscriptionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plans.length === 0 && (
            <div className="py-8 text-center text-color-text-muted text-sm">No plans defined</div>
          )}
        </div>

        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <h3 className="py-3 px-4 m-0 text-base font-semibold text-color-text border-b border-color-border">
            Per-Restaurant Billing
          </h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full border-collapse text-sm [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Restaurant</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text">Plan</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text" data-align="right">Orders</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text" data-align="right">Revenue</th>
                  <th className="py-2 px-4 text-left font-semibold text-color-text" data-align="right">Commission</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => {
                  const commission = (s.revenue * s.commissionPercent) / 100;
                  return (
                    <tr key={s.id} className="border-b border-color-border last:border-0">
                      <td className="py-2 px-4">{s.tenantName || s.subdomain}</td>
                      <td className="py-2 px-4">{s.planName}</td>
                      <td className="py-2 px-4" data-align="right">{s.orderCount}</td>
                      <td className="py-2 px-4" data-align="right">{Eur(s.revenue)}</td>
                      <td className="py-2 px-4 font-medium" data-align="right">{Eur(commission)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {subscriptions.length === 0 && (
            <div className="py-8 text-center text-color-text-muted text-sm">No active subscriptions</div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-color-bg border border-color-border text-sm text-color-text-muted">
        <strong>Note:</strong> Invoice generation and automated billing cycles will be added in a future release.
        Commission is computed from completed orders only.
      </div>
    </div>
  );
}
