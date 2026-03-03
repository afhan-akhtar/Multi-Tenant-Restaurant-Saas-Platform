"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function ProductsManagement({ products: initial, categories }) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", plu: "", basePrice: "", taxRate: "0.19", categoryId: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { setProducts(initial); }, [initial]);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Use JPEG, PNG, WebP or GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image max 5MB");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setLoading("add");
    try {
      let imageUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await upRes.json().catch(() => ({}));
        if (!upRes.ok) {
          setError(upData.error || "Image upload failed");
          setLoading(null);
          return;
        }
        imageUrl = upData.url || "";
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          plu: form.plu.trim(),
          basePrice: parseFloat(form.basePrice) || 0,
          taxRate: parseFloat(form.taxRate) || 0.19,
          categoryId: form.categoryId,
          imageUrl: imageUrl || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to add");
        return;
      }
      setModalOpen(false);
      setForm({ name: "", description: "", plu: "", basePrice: "", taxRate: "0.19", categoryId: "" });
      clearImage();
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
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
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

  if (categories?.length === 0) {
    return (
      <div className="py-4 w-full min-w-0">
        <div className="py-8 px-6 text-center text-color-text-muted bg-color-card rounded-lg border border-color-border">
          <p className="m-0 font-medium">Add a category first</p>
          <p className="m-0 mt-1 text-sm">Go to Categories and create at least one category, then you can add products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 w-full min-w-0 md:py-3 sm:py-2">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6 md:flex-col md:items-start md:mb-4">
        <h2 className="m-0 text-xl font-semibold text-color-text md:text-lg sm:text-base">Products</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
        >
          + Add Product
        </button>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-4 lg:gap-3.5 md:gap-3 sm:gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-color-card rounded-lg border border-color-border overflow-hidden transition-all hover:shadow-md group relative">
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover object-center" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🍽</div>
              )}
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: true, id: p.id, name: p.name })}
                disabled={loading === p.id}
                className="absolute top-2 right-2 py-1 px-2 bg-red-500/90 text-white rounded text-xs font-medium border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
            <div className="p-4 md:p-3 sm:p-2.5">
              <div className="font-semibold text-base text-color-text mb-1 md:text-[0.95rem] sm:text-sm">{p.name}</div>
              <div className="text-sm text-color-text-muted mb-2 sm:text-xs">{p.category?.name}</div>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-bold text-primary">€{Number(p.basePrice).toLocaleString()}</span>
                <span
                  className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                  style={{
                    background: p.isActive ? "#dcfce7" : "#fee2e2",
                    color: p.isActive ? "#166534" : "#991b1b",
                  }}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem] bg-color-card rounded-lg border border-color-border">
          No products yet. Add one to get started.
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-color-card rounded-xl shadow-xl border border-color-border p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">Add Product</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Name *</label>
                <input type="text" required placeholder="e.g. Margherita Pizza" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Category *</label>
                <select required className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Description</label>
                <input type="text" placeholder="Optional" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-color-text">Product Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer file:text-sm"
                  onChange={handleImageChange}
                />
                <p className="mt-1 text-xs text-color-text-muted">JPEG, PNG, WebP or GIF. Max 5MB.</p>
                {imagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded border border-color-border" />
                    <button type="button" onClick={clearImage} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs border-0 cursor-pointer flex items-center justify-center">×</button>
                  </div>
                )}
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-color-text">PLU</label>
                  <input type="text" placeholder="e.g. PIZ001" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.plu} onChange={(e) => setForm((f) => ({ ...f, plu: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-color-text">Price (€) *</label>
                  <input type="number" step="0.01" min="0" required placeholder="9.99" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.basePrice} onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))} />
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-1 text-sm font-medium text-color-text">Tax rate (e.g. 0.19)</label>
                <input type="number" step="0.01" min="0" placeholder="0.19" className="w-full py-2 px-3 border border-color-border rounded-lg bg-color-bg text-color-text" value={form.taxRate} onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))} />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => { setModalOpen(false); setError(""); clearImage(); }} className="py-2 px-4 border border-color-border rounded-lg text-color-text cursor-pointer hover:bg-color-bg">Cancel</button>
                <button type="submit" disabled={loading === "add"} className="py-2 px-4 bg-primary text-white rounded-lg font-medium border-0 cursor-pointer disabled:opacity-70">{loading === "add" ? "Adding…" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: "" })}
        loading={loading === deleteConfirm.id}
      />
    </div>
  );
}
