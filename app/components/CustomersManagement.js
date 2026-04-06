"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";
import {
  normalizeCustomerPhone,
  isValidCustomerPhoneDigits,
  formatPhoneDigitsForDisplay,
} from "@/lib/customerPhone";

export default function CustomersManagement({ customers: initial }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingWalkIn, setEditingWalkIn] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "" });
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ phone: "" });

  useEffect(() => {
    setCustomers(initial);
  }, [initial]);

  const resetForm = () => {
    setForm({ phone: "" });
    setEditingId(null);
    setEditingWalkIn(false);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setForm({ phone: c.phone || "" });
    setEditingId(c.id);
    setEditingWalkIn(String(c.email || "").toLowerCase() === "walkin@internal.local");
    setModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(editingId ? "edit" : "add");
    try {
      if (editingId) {
        const editDigits = normalizeCustomerPhone(form.phone);
        if (!editingWalkIn && !isValidCustomerPhoneDigits(editDigits)) {
          setError("Enter a valid mobile number (7–15 digits).");
          setLoading(null);
          return;
        }
        const res = await fetch(`/api/customers/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: form.phone.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "Failed to update");
          return;
        }
      } else {
        const digits = normalizeCustomerPhone(form.phone);
        if (!isValidCustomerPhoneDigits(digits)) {
          setError("Enter a valid mobile number (7–15 digits).");
          setLoading(null);
          return;
        }
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            Register by mobile number only — same as POS. Used for orders and loyalty.
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
          <table className="w-full border-collapse text-sm min-w-[320px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Phone</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Loyalty</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const isWalkIn =
                  String(c.email || "").toLowerCase() === "walkin@internal.local" || c.name === "Walk-in";
                const phoneLabel =
                  isWalkIn && !c.phone
                    ? "Guest / Walk-in"
                    : formatPhoneDigitsForDisplay(c.phone) || c.phone || "—";
                return (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 font-medium">{phoneLabel}</td>
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
                      onClick={() =>
                        setDeleteConfirm({
                          open: true,
                          id: c.id,
                          name: phoneLabel,
                        })
                      }
                      disabled={loading === c.id}
                      className="py-1.5 px-3 bg-red-100 text-red-700 rounded text-xs font-medium border-0 cursor-pointer hover:bg-red-200 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">
            No customers yet. Add a mobile number for orders and loyalty.
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
                <label className="block text-sm font-medium text-color-text mb-1">Mobile number *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className="w-full py-2 px-3 border border-color-border rounded-lg"
                  value={form.phone}
                  onChange={(e) => setForm({ phone: e.target.value })}
                  placeholder="7–15 digits"
                  required={!editingId || !editingWalkIn}
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
                  disabled={
                    loading ||
                    (!editingId && !isValidCustomerPhoneDigits(normalizeCustomerPhone(form.phone))) ||
                    (!!editingId &&
                      !editingWalkIn &&
                      !isValidCustomerPhoneDigits(normalizeCustomerPhone(form.phone)))
                  }
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
