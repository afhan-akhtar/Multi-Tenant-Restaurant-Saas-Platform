"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function CustomersManagement({ customers: initial }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "" });
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    setCustomers(initial);
  }, [initial]);

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "" });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setForm({
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
    });
    setEditingId(c.id);
    setModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(editingId ? "edit" : "add");
    try {
      if (editingId) {
        const res = await fetch(`/api/customers/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "Failed to update");
          return;
        }
      } else {
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "Failed to add");
          return;
        }
      }
      setModalOpen(false);
      resetForm();
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
      const res = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
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
        <div>
          <h2 className="m-0 text-xl font-semibold text-color-text">Customers</h2>
          <p className="m-0 mt-1 text-sm text-color-text-muted">
            Add customers for orders, loyalty, and segments. Customers appear in POS and KDS receipts.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
        >
          + Add Customer
        </button>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">{error}</div>}
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Email</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Phone</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Loyalty</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{c.name}</td>
                  <td className="py-3 px-4 text-color-text-muted">{c.email}</td>
                  <td className="py-3 px-4 text-color-text-muted">{c.phone || "—"}</td>
                  <td className="py-3 px-4" data-align="right">{c.loyaltyPoints ?? 0}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="py-1.5 px-3 mr-2 bg-slate-100 text-color-text rounded text-xs font-medium border-0 cursor-pointer hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ open: true, id: c.id, name: c.name })}
                      disabled={loading === c.id}
                      className="py-1.5 px-3 bg-red-100 text-red-700 rounded text-xs font-medium border-0 cursor-pointer hover:bg-red-200 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">
            No customers yet. Add customers for orders, loyalty, and marketing.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-color-text mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full py-2 px-3 border border-color-border rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-color-text mb-1">Email</label>
                <input
                  type="email"
                  className="w-full py-2 px-3 border border-color-border rounded-lg"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-color-text mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full py-2 px-3 border border-color-border rounded-lg"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); resetForm(); }}
                  className="py-2 px-4 border border-color-border rounded-lg text-color-text cursor-pointer hover:bg-color-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.name?.trim()}
                  className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "..." : editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete customer"
        message={`Delete "${deleteConfirm.name}"? This cannot be undone. Customers with orders cannot be deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: "" })}
        loading={loading === deleteConfirm.id}
      />
    </div>
  );
}
