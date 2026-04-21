"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { formatEur } from "@/lib/currencyFormat";
import { QrMenuPayAndPlaceOrder, QrMenuStripeProvider } from "./QrStripeCheckout";

function cartStorageKey(tenantId, tableId) {
  return `qr_cart_${tenantId}_${tableId}`;
}

function loadCart(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(key, cart) {
  try {
    localStorage.setItem(key, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

function InnerMenu() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id");
  const tableId = searchParams.get("table_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [cart, setCart] = useState([]);
  const [addonProduct, setAddonProduct] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [statusPoll, setStatusPoll] = useState(null);
  const [paymentOpts, setPaymentOpts] = useState(null);

  const storageKey = useMemo(() => {
    if (!tenantId || !tableId) return null;
    return cartStorageKey(tenantId, tableId);
  }, [tenantId, tableId]);

  useEffect(() => {
    if (!storageKey) return;
    setCart(loadCart(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    saveCart(storageKey, cart);
  }, [cart, storageKey]);

  useEffect(() => {
    if (!tenantId || !tableId) {
      setLoading(false);
      setError("Missing table link. Scan a valid table QR code.");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/public/menu?tenant_id=${encodeURIComponent(tenantId)}&table_id=${encodeURIComponent(tableId)}`,
          { cache: "no-store" }
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Menu unavailable");
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load menu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tenantId, tableId]);

  useEffect(() => {
    if (!tenantId) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/public/table-order-payment-options?tenant_id=${encodeURIComponent(tenantId)}`,
          { cache: "no-store" }
        );
        const j = await r.json().catch(() => ({}));
        if (!cancelled && r.ok) setPaymentOpts(j);
        else if (!cancelled) setPaymentOpts({ requireOnlinePayment: false, stripe: { enabled: false, publishableKey: null } });
      } catch {
        if (!cancelled) setPaymentOpts({ requireOnlinePayment: false, stripe: { enabled: false, publishableKey: null } });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const productsByCategory = useMemo(() => {
    if (!data?.products) return new Map();
    const m = new Map();
    for (const p of data.products) {
      const cid = p.categoryId;
      if (!m.has(cid)) m.set(cid, []);
      m.get(cid).push(p);
    }
    return m;
  }, [data]);

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
          addonItemIds: addons.map((a) => a.id),
        },
      ];
    });
    setAddonProduct(null);
    setSelectedAddons({});
  };

  const toggleAddon = (groupId, item) => {
    setSelectedAddons((prev) => {
      const group = prev[groupId] || [];
      const g = data?.addonGroups?.find((x) => x.id === groupId);
      const maxSelect = g?.maxSelect ?? 99;
      const exists = group.find((i) => i.id === item.id);
      let newGroup = exists
        ? group.filter((i) => i.id !== item.id)
        : [...group, item];
      if (!exists && newGroup.length > maxSelect) {
        newGroup = newGroup.slice(-maxSelect);
      }
      return { ...prev, [groupId]: newGroup };
    });
  };

  const confirmAddWithAddons = () => {
    const addons = Object.values(selectedAddons).flat();
    if (addonProduct) addToCart(addonProduct, addons);
  };

  const updateQty = (index, delta) => {
    setCart((prev) => {
      const item = prev[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((i, idx) => (idx === index ? { ...i, quantity: newQty } : i));
    });
  };

  const removeLine = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxAmount = subtotal * 0.1;
  const grandTotal = subtotal + taxAmount;

  const placeOrder = async () => {
    if (!tenantId || !tableId || cart.length === 0 || placing) return;
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/qr-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: Number(tenantId),
          table_id: Number(tableId),
          items: cart.map((c) => ({
            productId: c.productId,
            quantity: c.quantity,
            ...(c.addonItemIds?.length ? { addonItemIds: c.addonItemIds } : {}),
          })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Order failed");
      setPlaced({
        orderNumber: json.orderNumber,
        qrClientToken: json.qrClientToken,
        grandTotal: json.grandTotal,
      });
      setCart([]);
      if (storageKey) saveCart(storageKey, []);
    } catch (e) {
      setError(e.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  const refreshStatus = useCallback(async () => {
    if (!placed?.qrClientToken || !tenantId) return;
    try {
      const res = await fetch(
        `/api/qr-order/status?tenant_id=${encodeURIComponent(tenantId)}&token=${encodeURIComponent(placed.qrClientToken)}`,
        { cache: "no-store" }
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok) setStatusPoll(json);
    } catch {
      /* ignore */
    }
  }, [placed?.qrClientToken, tenantId]);

  useEffect(() => {
    if (!placed?.qrClientToken) {
      setStatusPoll(null);
      return undefined;
    }
    refreshStatus();
    const id = window.setInterval(refreshStatus, 4000);
    return () => window.clearInterval(id);
  }, [placed?.qrClientToken, refreshStatus]);

  if (!tenantId || !tableId) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-slate-50">
        <p className="text-slate-600 text-center">{error || "Invalid link"}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading menu…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-slate-50">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  const tenantLabel = data?.tenant?.name || "Menu";
  const tableLabel = data?.table?.name ? `Table ${data.table.name}` : "Dine-in";

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-28">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {data?.tenant?.logoUrl ? (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              <Image src={data.tenant.logoUrl} alt="" fill className="object-cover" sizes="40px" unoptimized />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
              {tenantLabel.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-slate-900 truncate m-0">{tenantLabel}</h1>
            <p className="text-xs text-slate-500 m-0">{tableLabel}</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-3 pt-4 space-y-6">
        {error ? (
          <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>
        ) : null}

        {placed ? (
          <section className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 m-0 mb-1">Order placed</h2>
            <p className="text-sm text-slate-600 m-0 mb-3">
              {placed.orderNumber} · {formatEur(placed.grandTotal)}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  statusPoll?.guestPhase === "ready"
                    ? "bg-emerald-100 text-emerald-800"
                    : statusPoll?.guestPhase === "preparing"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {statusPoll?.guestStatus || "Pending"}
              </span>
              <span className="text-xs text-slate-500">Updates every few seconds</span>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-medium"
              onClick={() => {
                setPlaced(null);
                setStatusPoll(null);
              }}
            >
              Order something else
            </button>
          </section>
        ) : null}

        {!placed &&
          data?.categories?.map((cat) => {
            const list = productsByCategory.get(cat.id) || [];
            if (list.length === 0) return null;
            return (
              <section key={cat.id}>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide px-1 mb-2">
                  {cat.name}
                </h2>
                <div className="space-y-3">
                  {list.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() =>
                        data.addonGroups?.length ? setAddonProduct(product) : addToCart(product, [])
                      }
                      className="w-full text-left rounded-2xl bg-white border border-slate-200 p-3 flex gap-3 shadow-sm active:scale-[0.99] transition-transform"
                    >
                      <div className="relative w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-2xl">🍽</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 leading-tight">{product.name}</div>
                        {product.description ? (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 m-0">{product.description}</p>
                        ) : null}
                        <div className="text-primary font-bold mt-2">{formatEur(product.basePrice)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
      </main>


      {!placed && (
        <div id="qr-cart-sheet" className="max-w-lg mx-auto px-3 pb-8 pt-4 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 m-0">Your order</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-slate-500 m-0">Tap items above to add them.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, index) => (
                <li
                  key={`${item.productId}-${item.modifierNames}-${index}`}
                  className="flex items-start gap-2 rounded-xl bg-white border border-slate-200 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm">
                      {item.quantity}× {item.productName}
                    </div>
                    {item.modifierNames ? (
                      <div className="text-xs text-slate-500 mt-0.5">{item.modifierNames}</div>
                    ) : null}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700"
                        onClick={() => updateQty(index, -1)}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700"
                        onClick={() => updateQty(index, 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-600 ml-auto self-center"
                        onClick={() => removeLine(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 shrink-0">
                    {formatEur(item.unitPrice * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatEur(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax (10%)</span>
                <span>{formatEur(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatEur(grandTotal)}</span>
              </div>
              {paymentOpts?.requireOnlinePayment && paymentOpts?.stripe?.publishableKey ? (
                <QrMenuStripeProvider publishableKey={paymentOpts.stripe.publishableKey}>
                  <QrMenuPayAndPlaceOrder
                    tenantId={tenantId}
                    tableId={tableId}
                    cart={cart}
                    grandTotal={grandTotal}
                    placing={placing}
                    setPlacing={setPlacing}
                    setError={setError}
                    setPlaced={setPlaced}
                    setCart={setCart}
                    storageKey={storageKey}
                    saveCart={saveCart}
                    formatEur={formatEur}
                  />
                </QrMenuStripeProvider>
              ) : (
                <button
                  type="button"
                  disabled={placing}
                  onClick={placeOrder}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-60"
                >
                  {placing ? "Sending…" : "Place order"}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {addonProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setAddonProduct(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-3 px-4 border-b border-slate-200 font-semibold">Add — {addonProduct.name}</div>
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {(data?.addonGroups || []).map((group) => (
                <div key={group.id}>
                  <div className="text-sm font-medium text-slate-800 mb-2">
                    {group.name}{" "}
                    <span className="text-slate-400 font-normal">
                      (choose {group.minSelect || 0}–{group.maxSelect})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.addonItems.map((item) => {
                      const selected = (selectedAddons[group.id] || []).some((i) => i.id === item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleAddon(group.id, item)}
                          className={`py-2 px-3 rounded-lg text-sm border ${
                            selected
                              ? "bg-primary border-primary text-white"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          {item.name} (+{formatEur(item.price)})
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2 justify-end">
              <button
                type="button"
                className="py-2.5 px-4 rounded-lg border border-slate-200"
                onClick={() => setAddonProduct(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2.5 px-4 rounded-lg bg-primary text-white font-medium"
                onClick={confirmAddWithAddons}
              >
                Add to order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
          <p className="text-slate-500">Loading…</p>
        </div>
      }
    >
      <InnerMenu />
    </Suspense>
  );
}
