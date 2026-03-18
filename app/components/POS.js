"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import POSPaymentModal from "./POSPaymentModal";
import { printReceipt } from "./Receipt";
import { formatEur } from "@/lib/currencyFormat";

const CATEGORY_COLORS = ["#1a202c", "#3182ce", "#4299e1", "#48bb78", "#ed64a6"];

export default function POS({ data }) {
  const router = useRouter();
  const { categories = [], products = [], addonGroups = [], customers: initialCustomers = [], nextOrderNumber = 1 } = data || {};

  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => initialCustomers[0]?.id ?? null);
  const [cart, setCart] = useState([]);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({ name: "", phone: "" });
  const [quickAddLoading, setQuickAddLoading] = useState(false);
  const [orderType] = useState("TAKEAWAY");
  const [orderNumber, setOrderNumber] = useState(() => `ORD${nextOrderNumber}`);
  useEffect(() => {
    setOrderNumber(`ORD${nextOrderNumber}`);
  }, [nextOrderNumber]);

  useEffect(() => {
    setCustomers(initialCustomers);
    if (initialCustomers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(initialCustomers[0].id);
    }
  }, [initialCustomers]);

  useEffect(() => {
    if (customers.length > 0 && (!selectedCustomerId || !customers.some((c) => c.id === selectedCustomerId))) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddForm.name?.trim()) return;
    setQuickAddLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quickAddForm.name.trim(),
          phone: quickAddForm.phone.trim(),
          email: quickAddForm.name.trim().toLowerCase().replace(/\s+/g, "") + "@guest.local",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed");
      const newCustomer = data.customer;
      setCustomers((prev) => [...prev, newCustomer]);
      setSelectedCustomerId(newCustomer.id);
      setQuickAddOpen(false);
      setQuickAddForm({ name: "", phone: "" });
      setToast({ type: "success", message: `${newCustomer.name} added` });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to add" });
    } finally {
      setQuickAddLoading(false);
    }
  };
  const [addonProduct, setAddonProduct] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  const addToCart = (product, addons = []) => {
    const addonTotal = addons.reduce((s, a) => s + Number(a.price || 0), 0);
    const unitPrice = Number(product.basePrice) + addonTotal;
    const modifierNames = addons.map((a) => a.name).join(", ");

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.modifierNames === modifierNames
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitPrice,
          taxRate: Number(product.taxRate) || 10,
          quantity: 1,
          addonTotal,
          modifierNames,
          addons,
        },
      ];
    });
    setAddonProduct(null);
    setSelectedAddons({});
  };

  const openAddonModal = (product) => {
    if (addonGroups.length > 0) {
      setAddonProduct(product);
      setSelectedAddons({});
    } else {
      addToCart(product, []);
    }
  };

  const toggleAddon = (groupId, item) => {
    setSelectedAddons((prev) => {
      const group = prev[groupId] || [];
      const exists = group.find((i) => i.id === item.id);
      const newGroup = exists
        ? group.filter((i) => i.id !== item.id)
        : [...group, item];
      return { ...prev, [groupId]: newGroup };
    });
  };

  const confirmAddWithAddons = () => {
    const addons = Object.values(selectedAddons).flat();
    addToCart(addonProduct, addons);
  };

  const updateCartItemQty = (index, delta) => {
    setCart((prev) => {
      const item = prev[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((i, idx) => (idx === index ? { ...i, quantity: newQty } : i));
    });
  };

  const removeCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxAmount = subtotal * 0.1;
  const grandTotal = subtotal + taxAmount;

  const [lastReceipt, setLastReceipt] = useState(null);

  const handlePaymentSuccess = (result) => {
    setCart([]);
    if (result?.queued) {
      setLastReceipt(null);
      setToast({ type: "success", message: `Order queued for sync when online (${result.localOrderNumber})` });
    } else {
      setLastReceipt(result?.receipt || null);
      setToast({ type: "success", message: `Order ${result?.orderNumber} paid successfully!` });
    }
    router.refresh();
  };

  const handlePrintReceipt = () => {
    if (lastReceipt) {
      printReceipt(lastReceipt);
    } else if (cart.length > 0) {
      setToast({ type: "error", message: "Pay first to print receipt" });
    } else {
      setToast({ type: "error", message: "No receipt to print" });
    }
  };

  const openPayModal = () => {
    if (cart.length === 0) return;
    setPayModalOpen(true);
  };

  const openClearConfirm = () => {
    if (cart.length === 0) return;
    setConfirmClearOpen(true);
  };

  const confirmClearCart = () => {
    setCart([]);
    setConfirmClearOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[500px] bg-white lg:flex-row flex-col">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="sticky top-0 z-10 bg-[#2d3748] py-3 px-4 flex items-center gap-2 shrink-0">
          <span className="text-slate-300 font-semibold mr-4">Restaurant POS</span>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                className={`py-2 px-4 border-none rounded-md cursor-pointer font-medium text-sm transition-all ${
                  selectedCategoryId === cat.id ? "bg-[#1a202c] text-white" : "bg-[#4a5568] text-white"
                }`}
                style={
                  selectedCategoryId === cat.id
                    ? { background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }
                    : {}
                }
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
            {categories.length === 0 && (
              <span className="text-slate-400 text-sm">No categories</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 content-start md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:p-4 sm:gap-4 xs:grid-cols-2 xs:gap-3 xs:p-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-color-border rounded-xl p-4 cursor-pointer transition-all flex flex-col gap-2.5 shadow-sm hover:border-primary hover:shadow-[0_4px_16px_rgba(233,69,96,0.2)]"
              onClick={() => openAddonModal(product)}
            >
              <div className="w-full aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-3xl overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span>🍽</span>
                )}
              </div>
              <div className="font-bold text-[1.05rem] text-[#1a1d29] text-center leading-tight">{product.name}</div>
              <div className="text-xs text-slate-500 leading-snug line-clamp-2 text-center min-h-[2.4em]">{product.description}</div>
              <div className="font-bold text-lg text-primary mt-auto text-center">
                {formatEur(product.basePrice)}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm col-span-full">No products in this category</div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[360px] xl:w-[360px] shrink-0 flex flex-col border-l border-color-border bg-white lg:border-t-0 md:border-t md:border-l-0">
        <div className="bg-[#3182ce] text-white py-3 px-4 font-semibold">
          <div className="text-xs opacity-90">{orderType === "TAKEAWAY" ? "Takeaway" : "Dine-In"}</div>
          <div className="text-[1.1rem]">{orderNumber}</div>
        </div>
        <div className="px-4 py-2 border-b border-color-border">
          <label className="block text-xs font-medium text-color-text-muted mb-1">Customer</label>
          <div className="flex gap-2">
            <select
              value={selectedCustomerId ?? ""}
              onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="flex-1 py-2 px-3 border border-color-border rounded-lg text-sm bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name === "Walk-in" ? "Guest / Walk-in" : c.name}
                  {c.phone && c.name !== "Walk-in" ? ` (${c.phone})` : ""}
                </option>
              ))}
              {customers.length === 0 && (
                <option value="">Guest (add in Customers)</option>
              )}
            </select>
            <button
              type="button"
              onClick={() => setQuickAddOpen(true)}
              className="py-2 px-3 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 shrink-0"
              title="Quick add new customer"
            >
              + New
            </button>
          </div>
          <p className="text-[10px] text-color-text-muted mt-0.5">
            Guest = unregistered. Use + New to add on the spot.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-4">
          {cart.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Add items from the menu</div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="py-3 border-b border-slate-100">
                <div className="flex justify-between items-start text-sm">
                  <span className="font-medium text-[#1a1d29]">
                    {item.quantity}× {item.productName}
                  </span>
                  <span className="font-semibold text-primary">
                    {formatEur(item.unitPrice * item.quantity)}
                  </span>
                </div>
                {item.modifierNames && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.modifierNames.split(", ").map((m, i) => (
                      <span key={i} className="text-xs py-0.5 px-1.5 bg-amber-100 text-amber-800 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-1">
                  <button onClick={() => updateCartItemQty(index, -1)} className="mr-2">−</button>
                  {item.quantity}
                  <button onClick={() => updateCartItemQty(index, 1)} className="ml-2">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="py-4 px-4 bg-[#2d3748] text-white text-sm">
          <div className="flex justify-between py-1.5"> <span>Total Order</span> <span>{formatEur(subtotal)}</span> </div>
          <div className="flex justify-between py-1.5"> <span>Tax (10%)</span> <span>{formatEur(taxAmount)}</span> </div>
          <div className="flex justify-between py-1.5"> <span>Discount</span> <span>€0</span> </div>
          <div className="flex justify-between pt-2 mt-2 border-t border-white/30 font-bold text-[1.1rem]">
            <span>Total Payable</span>
            <span>{formatEur(grandTotal)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4 border-t border-color-border">
          <button className="py-2.5 px-4 border border-color-border bg-white rounded-lg text-xl text-slate-500 transition-all hover:bg-color-bg hover:text-[#3182ce]" onClick={() => cart[0] && updateCartItemQty(0, -1)}>−</button>
          <button className="py-2.5 px-4 border border-color-border bg-white rounded-lg text-xl text-slate-500 transition-all hover:bg-color-bg hover:text-[#3182ce]" onClick={() => cart[0] && updateCartItemQty(0, 1)}>+</button>
          <button
            className="py-2.5 px-4 border border-color-border bg-white rounded-lg text-xl text-slate-500 transition-all hover:bg-color-bg hover:text-[#3182ce] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Print receipt"
            onClick={handlePrintReceipt}
          >
            🖨
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 pb-4 lg:grid-cols-3 sm:grid-cols-1">
          <button
            className="py-4 px-5 rounded-xl font-semibold text-base cursor-pointer transition-all border-2 border-[#3182ce] text-[#3182ce] hover:border-[#2b6cb0] bg-gradient-to-b from-white to-slate-50 hover:from-cyan-50 hover:to-emerald-50 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            onClick={openClearConfirm}
          >
            Clear
          </button>
          <button
            className="py-4 px-5 rounded-xl font-semibold text-base cursor-pointer transition-all border-2 border-[#2b6cb0] text-white bg-gradient-to-br from-[#3182ce] to-[#2c5282] shadow-[0_4px_14px_rgba(49,130,206,0.4)] hover:shadow-[0_6px_20px_rgba(49,130,206,0.5)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            onClick={openPayModal}
            disabled={cart.length === 0}
          >
            Pay
          </button>
          <button
            className="py-4 px-5 rounded-xl font-semibold text-base cursor-pointer transition-all border-2 border-slate-400 text-slate-500 bg-gradient-to-b from-white to-slate-50 hover:border-slate-500 hover:from-slate-100 hover:to-slate-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => router.back()}
          >
            Exit
          </button>
        </div>
      </div>

      {quickAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4" onClick={() => setQuickAddOpen(false)}>
          <div className="bg-white rounded-xl max-w-[340px] w-full p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="m-0 mb-3 text-base font-semibold text-color-text">Quick add customer</h3>
            <p className="m-0 mb-4 text-xs text-color-text-muted">Unregistered customer? Add them here for this order.</p>
            <form onSubmit={handleQuickAdd}>
              <div className="mb-3">
                <label className="block text-xs font-medium text-color-text mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full py-2 px-3 border border-color-border rounded-lg text-sm"
                  value={quickAddForm.name}
                  onChange={(e) => setQuickAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Customer name"
                  required
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-color-text mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full py-2 px-3 border border-color-border rounded-lg text-sm"
                  value={quickAddForm.phone}
                  onChange={(e) => setQuickAddForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(false)}
                  className="py-2 px-3 rounded-lg border border-color-border text-color-text text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quickAddLoading || !quickAddForm.name?.trim()}
                  className="py-2 px-4 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-60"
                >
                  {quickAddLoading ? "..." : "Add & select"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmClearOpen && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4" onClick={() => setConfirmClearOpen(false)}>
          <div className="bg-white rounded-xl max-w-[400px] w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-[1.1rem] text-[#1a1d29] m-0 mb-3">Clear cart</h3>
            <p className="text-[0.95rem] text-slate-500 m-0 mb-6">Clear all items from this order?</p>
            <div className="flex gap-3 justify-end">
              <button
                className="py-2.5 px-5 rounded-lg font-medium text-sm cursor-pointer border-none bg-slate-100 text-slate-500 hover:bg-slate-200"
                onClick={() => setConfirmClearOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2.5 px-5 rounded-lg font-medium text-sm cursor-pointer border-none bg-primary text-white hover:bg-primary-hover"
                onClick={confirmClearCart}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {addonProduct && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setAddonProduct(null)}>
          <div className="bg-white rounded-xl max-w-[480px] w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="py-4 px-6 border-b border-color-border font-semibold text-[1.1rem]">
              Add modifiers: {addonProduct.name}
            </div>
            <div className="py-4 px-6 overflow-y-auto flex-1">
              {addonGroups.length > 0 ? (
                addonGroups.map((group) => (
                  <div key={group.id} className="mb-4">
                    <div className="text-sm font-semibold mb-2 text-color-text">
                      {group.name} (min: {group.minSelect}, max: {group.maxSelect})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.addonItems.map((item) => {
                        const selected = (selectedAddons[group.id] || []).some(
                          (i) => i.id === item.id
                        );
                        return (
                          <button
                            key={item.id}
                            className={`py-2 px-3 border rounded-lg text-sm cursor-pointer transition-all ${
                              selected
                                ? "bg-[#3182ce] border-[#3182ce] text-white"
                                : "border-color-border bg-white hover:border-[#3182ce] hover:text-[#3182ce]"
                            }`}
                            onClick={() => toggleAddon(group.id, item)}
                          >
                            {item.name} (+{formatEur(item.price)})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-color-text-muted">No add-ons available</p>
              )}
            </div>
            <div className="py-4 px-6 border-t border-color-border flex gap-3 justify-end">
              <button
                className="py-2.5 px-5 rounded-lg font-medium cursor-pointer border-none bg-slate-100 text-slate-500"
                onClick={() => setAddonProduct(null)}
              >
                Cancel
              </button>
              <button
                className="py-2.5 px-5 rounded-lg font-medium cursor-pointer border-none bg-[#3182ce] text-white"
                onClick={confirmAddWithAddons}
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      <POSPaymentModal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        grandTotal={grandTotal}
        cart={cart}
        orderNumber={orderNumber}
        orderType={orderType}
        customerId={selectedCustomerId}
        onSuccess={handlePaymentSuccess}
      />

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] py-3 px-6 rounded-[10px] text-[0.95rem] font-medium shadow-lg animate-toast-in ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
