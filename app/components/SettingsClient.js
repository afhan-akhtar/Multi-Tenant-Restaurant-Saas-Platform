"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { buildTenantUrl } from "@/lib/tenant-url";

function hubCard(href, title, body) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-color-border bg-color-card p-5 no-underline text-color-text shadow-sm hover:border-primary/40 hover:shadow-md transition-shadow"
    >
      <h3 className="m-0 text-base font-semibold text-color-text">{title}</h3>
      <p className="m-0 mt-2 text-sm text-color-text-muted leading-relaxed">{body}</p>
    </Link>
  );
}

export default function SettingsClient({ type, tenant, platform, basePath = "" }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [subdomainSaving, setSubdomainSaving] = useState(false);
  const [subdomainSaved, setSubdomainSaved] = useState(false);
  const [subdomainError, setSubdomainError] = useState("");
  const [form, setForm] = useState(
    tenant
      ? { name: tenant.name || "", subdomain: tenant.subdomain || "", country: tenant.country || "" }
      : {}
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type !== "tenant") return;
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, country: form.country }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSubdomainChange = async (e) => {
    e.preventDefault();
    if (type !== "tenant") return;
    setSubdomainError("");
    setSubdomainSaved(false);

    const nextSubdomain = String(form.subdomain || "").trim().toLowerCase();
    if (!nextSubdomain) {
      setSubdomainError("Enter a subdomain.");
      return;
    }

    if (nextSubdomain === String(tenant?.subdomain || "").trim().toLowerCase()) {
      setSubdomainSaved(true);
      setTimeout(() => setSubdomainSaved(false), 2500);
      return;
    }

    const ok = window.confirm(
      `Change subdomain from "${tenant?.subdomain}" to "${nextSubdomain}"?\n\nYou will be signed out and redirected to the new address.`
    );
    if (!ok) return;

    setSubdomainSaving(true);
    try {
      const res = await fetch("/api/settings/subdomain", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: nextSubdomain }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubdomainError(data.error || "Failed to update subdomain");
        return;
      }

      const updated = String(data.subdomain || nextSubdomain).trim();
      setSubdomainSaved(true);

      // JWT session contains the previous subdomain; sign out and move the browser to the new host.
      await signOut({ redirect: false });
      window.location.assign(
        buildTenantUrl({
          host: window.location.host,
          protocol: window.location.protocol.replace(":", ""),
          subdomain: updated,
          pathname: "/login",
        })
      );
    } catch (err) {
      setSubdomainError("Something went wrong");
    } finally {
      setSubdomainSaving(false);
    }
  };

  if (type === "platform") {
    const p = basePath.replace(/\/$/, "");
    const to = (path) => `${p}${path}`;
    return (
      <div className="py-4 w-full min-w-0 max-w-5xl">
        <h2 className="m-0 text-xl font-semibold text-color-text mb-2">Platform control center</h2>
        <p className="text-color-text-muted text-sm mb-6 max-w-2xl">
          Settings is the launch point for governance: onboarding and tenants, plans and billing, commission
          reconciliation, audit visibility, and secure impersonation. Each area opens in its own workspace below.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {hubCard(
            to("/restaurants"),
            "Restaurant management",
            "Onboarding and approvals, profile and branding, block/unblock with status sync, multi-branch counts, and activity signals from orders and audits."
          )}
          {hubCard(
            to("/subscriptions"),
            "Subscriptions & feature control",
            "Plans (Basic / Premium / Enterprise style), feature flags, billing cycle tools, trials and grace, invoices and payment history."
          )}
          {hubCard(
            to("/commission"),
            "Commission & billing",
            "Configurable % or flat-per-order from plan metadata, reconciliation from completed orders, CSV export for finance."
          )}
          {hubCard(
            to("/logs"),
            "Global logs",
            "Cross-tenant audit feed (read-only). Pair with 90-day retention policy and optional ElasticSearch / CloudWatch forwarding."
          )}
          {hubCard(
            to("/impersonation"),
            "Secure impersonation",
            "One-click tenant admin session with signed token, banner and expiry in the tenant shell, end session anytime."
          )}
        </div>

        <div className="bg-color-card rounded-lg border border-color-border p-6">
          <h3 className="m-0 text-base font-semibold text-color-text mb-4">Snapshot</h3>
          <div className="flex flex-col gap-3 text-sm max-w-md">
            <div className="flex justify-between">
              <span className="text-color-text-muted">Total restaurants</span>
              <span className="font-medium text-color-text">{platform?.tenantsCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-color-text-muted">Subscription plans</span>
              <span className="font-medium text-color-text">{platform?.plansCount ?? 0}</span>
            </div>
            {platform?.pendingCount != null && (
              <div className="flex justify-between">
                <span className="text-color-text-muted">Pending approval</span>
                <span className="font-medium text-amber-700 dark:text-amber-400">{platform.pendingCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Settings</h2>
      <form onSubmit={handleSubmit} className="bg-color-card rounded-lg border border-color-border p-6 max-w-lg">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-color-text mb-1">Restaurant Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
              placeholder="Your restaurant name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-color-text mb-1">Subdomain</label>
            <input
              type="text"
              value={form.subdomain}
              onChange={(e) => {
                setSubdomainError("");
                setSubdomainSaved(false);
                setForm({ ...form, subdomain: e.target.value });
              }}
              className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
            />
            <p className="mt-1 text-xs text-color-text-muted">
              Your public URL is based on this. Use letters, numbers, and hyphens only.
            </p>
            {subdomainError && (
              <div className="mt-2 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">{subdomainError}</div>
            )}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                disabled={subdomainSaving}
                onClick={handleSubdomainChange}
                className="py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90 disabled:opacity-60"
              >
                {subdomainSaving ? "Updating…" : "Update Subdomain"}
              </button>
              {subdomainSaved && <span className="text-sm text-green-600">Updated</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-color-text mb-1">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-color-border bg-color-bg text-color-text text-sm"
              placeholder="e.g. Germany"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>
      </form>
    </div>
  );
}
