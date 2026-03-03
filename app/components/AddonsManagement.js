"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function AddonsManagement({ addonGroups: initial }) {
  const router = useRouter();
  const [groups, setGroups] = useState(initial);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", minSelect: "0", maxSelect: "1" });

  useEffect(() => { setGroups(initial); }, [initial]);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setLoading("add");
    try {
      const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          minSelect: parseInt(form.minSelect, 10) || 0,
          maxSelect: parseInt(form.maxSelect, 10) || 1,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to add");
        return;
      }
      setModalOpen(false);
      setForm({ name: "", minSelect: "0", maxSelect: "1" });
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeleteConfirm() {
    const id = deleteConfirm.id;
    if (!id) return;
    setError("");
    setLoading(id);
    try {
      const res = await fetch(`/api/addons?id=${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to delete");
        setDeleteConfirm({ open: false, id: null, name: "" });
        return;
      }
      setDeleteConfirm({ open: false, id: null, name: "" });
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="py-4 w-full min-w-0">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="m-0 text-xl font-semibold text-color-text">Add-on Groups</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
        >
          + Add Group
        </button>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">{error}</div>}
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[500px]">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text text-right">Min</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text text-right">Max</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text text-right">Items</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{g.name}</td>
                  <td className="py-3 px-4 text-right">{g.minSelect}</td>
                  <td className="py-3 px-4 text-right">{g.maxSelect}</td>
                  <td className="py-3 px-4 text-right">{g._count?.addonItems ?? 0}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ open: true, id: g.id, name: g.name })}
                      disabled={loading === g.id}
                      className="py-1.5 px-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium border-0 cursor-pointer hover:bg-red-200 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {groups.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No add-on groups yet. Add one (e.g. Toppings, Size).</div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Add Add-on Group</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Name</label>
                <input type="text" required placeholder="e.g. Toppings, Size" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-color-text">Min select</label>
                  <input type="number" min="0" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.minSelect} onChange={(e) => setForm((f) => ({ ...f, minSelect: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-color-text">Max select</label>
                  <input type="number" min="0" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.maxSelect} onChange={(e) => setForm((f) => ({ ...f, maxSelect: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => { setModalOpen(false); setError(""); }} className="py-2 px-4 border border-color-border rounded-lg text-color-text cursor-pointer hover:bg-color-bg">Cancel</button>
                <button type="submit" disabled={loading === "add"} className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 cursor-pointer disabled:opacity-70">{loading === "add" ? "Adding…" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete Add-on Group"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: "" })}
        loading={loading === deleteConfirm.id}
      />
    </div>
  );
}
