"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { buildTenantUrl } from "@/lib/tenant-url";

export default function SettingsClient({ type, tenant, platform }) {
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
    return (
      <div className="py-4 w-full min-w-0">
        <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Platform Settings</h2>
        <div className="bg-color-card rounded-lg border border-color-border p-6 max-w-lg">
          <p className="text-color-text-muted text-sm mb-4">
            Platform-wide configuration is managed through Restaurant Management and Subscriptions.
          </p>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-color-text-muted">Total Restaurants</span>
              <span className="font-medium text-color-text">{platform?.tenantsCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-color-text-muted">Subscription Plans</span>
              <span className="font-medium text-color-text">{platform?.plansCount ?? 0}</span>
            </div>
          </div>
          <p className="mt-6 text-color-text-muted text-xs">
            To approve new tenants, go to Restaurant Management. To manage plans and commissions, use Subscriptions and Commission pages.
          </p>
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
