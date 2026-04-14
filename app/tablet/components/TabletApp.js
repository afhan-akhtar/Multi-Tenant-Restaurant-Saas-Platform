"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Receipt, printReceipt } from "@/app/components/Receipt";
import KdsCancelOrderModal from "@/app/components/kds/KdsCancelOrderModal";
import {
  KDS_COLUMNS,
  dedupeKdsOrders,
  getOrdersForColumn,
  KDSOrderCard,
} from "@/app/components/kds/KDSShared";
import { getDeviceHeaders, getTabletWaiterHeaders } from "@/lib/device-client";
import { runCashPaymentHardware } from "@/lib/pos-hardware-client";
import { formatEur } from "@/lib/currencyFormat";
import { buildEscPosReceipt } from "../lib/escpos";
import POSPaymentModal from "@/app/components/POSPaymentModal";

const CATEGORY_COLORS = ["#1a202c", "#3182ce", "#4299e1", "#48bb78", "#ed64a6", "#9f7aea", "#dd6b20"];

function money(n) {
  return formatEur(n);
}

function orderStatusLabel(status) {
  const s = String(status || "").toUpperCase();
  if (s === "OPEN" || s === "CONFIRMED") return "Pending";
  if (s === "PREPARING") return "Preparing";
  if (s === "READY" || s === "PACK") return "Ready";
  if (s === "COMPLETED") return "Served";
  return s || "—";
}

export default function TabletApp({ data, deviceAuth }) {
  const searchParams = useSearchParams();
  const tableFromUrl = searchParams.get("tableId");

  const categories = data?.categories || [];
  const addonGroups = data?.addonGroups || [];
  const tables = data?.tables || [];
  const products = useMemo(() => data?.products || [], [data?.products]);
  const customers = useMemo(() => data?.customers || [], [data?.customers]);
  const loyaltyEnabled = data?.loyaltyEnabled ?? false;
  const loyaltySettings = data?.loyaltySettings ?? {};

  const walkIn = useMemo(
    () => customers.find((c) => c.name === "Walk-in") || customers[0],
    [customers]
  );
  const loyaltyCustomerWalkIn =
    String(walkIn?.email || "").toLowerCase() === "walkin@internal.local";

  const [view, setView] = useState("order"); // order | floor | waiter
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? null
  );
  const [selectedTableId, setSelectedTableId] = useState(
    tableFromUrl ? Number(tableFromUrl) : tables[0]?.id ?? null
  );
  const [cart, setCart] = useState([]);
  const [addonProduct, setAddonProduct] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [orders, setOrders] = useState([]);
  const [tablesLive, setTablesLive] = useState([]);
  const [liveConnected, setLiveConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const [waiterSession, setWaiterSession] = useState(null);
  const [waiterStaff, setWaiterStaff] = useState([]);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedWaiterId, setSelectedWaiterId] = useState(null);

  const [mergeFrom, setMergeFrom] = useState(null);
  const [mergeTo, setMergeTo] = useState(null);
  const [transferSession, setTransferSession] = useState(null);
  const [transferTarget, setTransferTarget] = useState(null);
  const [daySummary, setDaySummary] = useState(null);

  const [kdsCancelModal, setKdsCancelModal] = useState({ open: false, orderId: null, orderNumber: "" });
  const [kdsCancelReason, setKdsCancelReason] = useState("");
  const [kdsCancelLoading, setKdsCancelLoading] = useState(false);
  const [kdsCancelError, setKdsCancelError] = useState("");
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [orderSeq, setOrderSeq] = useState(() => data?.nextOrderNumber ?? 1);
  const orderNumber = useMemo(() => `ORD${orderSeq}`, [orderSeq]);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  const cartSubtotal = useMemo(
    () => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [cart]
  );
  const cartTax = cartSubtotal * 0.1;
  const cartTotal = cartSubtotal + cartTax;

  const deviceHeaders = useMemo(() => getDeviceHeaders(deviceAuth), [deviceAuth]);
  const waiterHeaders = useMemo(
    () => getTabletWaiterHeaders(waiterSession),
    [waiterSession]
  );

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/tablet/orders", {
        cache: "no-store",
        headers: { ...deviceHeaders },
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(payload.orders)) {
        setOrders(payload.orders);
      }
    } catch (e) {
      console.error(e);
    }
  }, [deviceHeaders]);

  const kdsBoardOrders = useMemo(() => {
    const list = orders
      .map((o) => {
        const k = o.kdsOrder;
        if (!k) return null;
        const parentItems = Array.isArray(o.orderItems) ? o.orderItems : [];
        const kItems = Array.isArray(k.orderItems) ? k.orderItems : [];
        const orderItems =
          kItems.length > 0
            ? kItems
            : parentItems.map((item) => ({
                ...item,
                productName: item.productName || item.name || "Item",
              }));
        return { ...k, orderItems };
      })
      .filter(Boolean);
    return dedupeKdsOrders(list);
  }, [orders]);

  const handleKdsStatusChange = useCallback(
    async (orderId, newStatus) => {
      try {
        const res = await fetch(`/api/kds/order?id=${encodeURIComponent(orderId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...deviceHeaders,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.order) {
          showToast(data.error || "Could not update order");
          refreshOrders();
          return;
        }
        const next = data.order;
        const nextId = Number(next.id);
        const nextStatus = String(next.status || "").toUpperCase();
        setOrders((current) => {
          if (["CANCELLED", "COMPLETED", "REFUNDED"].includes(nextStatus)) {
            return current.filter((row) => row.id !== nextId);
          }
          return current.map((row) =>
            row.id === nextId ? { ...row, status: next.status, kdsOrder: next } : row
          );
        });
      } catch (e) {
        console.error(e);
        showToast("Could not update order");
        refreshOrders();
      }
    },
    [deviceHeaders, refreshOrders, showToast]
  );

  const openKdsCancelModal = useCallback((order) => {
    setKdsCancelModal({ open: true, orderId: order.id, orderNumber: order.orderNumber || `#${order.id}` });
    setKdsCancelReason("");
    setKdsCancelError("");
  }, []);

  const handleKdsCancelConfirm = useCallback(async () => {
    const orderId = kdsCancelModal.orderId;
    if (!orderId) return;
    setKdsCancelError("");
    setKdsCancelLoading(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...deviceHeaders,
        },
        body: JSON.stringify({
          orderId,
          reason: kdsCancelReason.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setKdsCancelModal({ open: false, orderId: null, orderNumber: "" });
      setKdsCancelReason("");
      setOrders((current) => current.filter((row) => row.id !== orderId));
    } catch (err) {
      console.error(err);
      setKdsCancelError(err.message || "Cancel failed");
    } finally {
      setKdsCancelLoading(false);
    }
  }, [deviceHeaders, kdsCancelModal.orderId, kdsCancelReason]);

  const refreshTables = useCallback(async () => {
    try {
      const res = await fetch("/api/tablet/tables", {
        cache: "no-store",
        headers: { ...deviceHeaders },
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(payload.tables)) {
        setTablesLive(payload.tables);
      }
    } catch (e) {
      console.error(e);
    }
  }, [deviceHeaders]);

  useEffect(() => {
    refreshOrders();
    refreshTables();
  }, [refreshOrders, refreshTables]);

  useEffect(() => {
    if (!receiptModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [receiptModalOpen]);

  useEffect(() => {
    if (view === "kitchen") {
      refreshOrders();
    }
  }, [view, refreshOrders]);

  useEffect(() => {
    if (!deviceAuth?.wsTicket || typeof window === "undefined") {
      return undefined;
    }
    const streamUrl = `/api/tablet/stream?ticket=${encodeURIComponent(deviceAuth.wsTicket)}`;
    const source = new EventSource(streamUrl);
    source.onopen = () => setLiveConnected(true);
    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (!message?.event) return;
        if (
          message.event.startsWith("order.") ||
          message.event === "connected"
        ) {
          refreshOrders();
          refreshTables();
        }
      } catch (e) {
        console.error(e);
      }
    };
    source.onerror = () => setLiveConnected(false);
    return () => source.close();
  }, [deviceAuth?.wsTicket, refreshOrders, refreshTables]);

  useEffect(() => {
    if (!pinOpen) return;
    fetch("/api/tablet/waiter/staff", { headers: { ...deviceHeaders } })
      .then((r) => r.json())
      .then((j) => {
        if (Array.isArray(j.staff)) setWaiterStaff(j.staff);
      })
      .catch(() => {});
  }, [pinOpen, deviceHeaders]);

  const addToCart = (product, addons = []) => {
    const addonTotal = addons.reduce((s, a) => s + Number(a.price || 0), 0);
    const unitPrice = Number(product.basePrice) + addonTotal;
    setCart((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        unitPrice,
        taxRate: Number(product.taxRate) || 10,
        quantity: 1,
        addonTotal,
        addons,
      },
    ]);
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
      const nextGroup = exists
        ? group.filter((i) => i.id !== item.id)
        : [...group, item];
      return { ...prev, [groupId]: nextGroup };
    });
  };

  const confirmAddons = () => {
    const addons = Object.values(selectedAddons).flat();
    addToCart(addonProduct, addons);
  };

  const updateQty = (index, delta) => {
    setCart((prev) => {
      const row = prev[index];
      const q = row.quantity + delta;
      if (q <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((r, i) => (i === index ? { ...r, quantity: q } : r));
    });
  };

  const openCheckout = () => {
    if (!cart.length) {
      showToast("Add items from the menu.");
      return;
    }
    if (!selectedTableId) {
      showToast("Select a table.");
      return;
    }
    setPayModalOpen(true);
  };

  const handlePaymentSuccess = (result) => {
    setLastReceipt(result?.receipt ?? null);
    if (result?.queued) {
      showToast(`Order queued — will sync when online (${result.localOrderNumber})`);
    } else {
      const l = result?.loyalty;
      const extra =
        l && (l.pointsEarned > 0 || l.pointsRedeemed > 0)
          ? ` · ${l.pointsEarned > 0 ? `+${l.pointsEarned} pts` : ""}${l.pointsEarned > 0 && l.pointsRedeemed > 0 ? ", " : ""}${l.pointsRedeemed > 0 ? `-${l.pointsRedeemed} pts` : ""}`
          : "";
      showToast(`Paid ${result?.orderNumber || "order"}${extra}`);
    }
    setCart([]);
    setOrderSeq((s) => s + 1);
    refreshOrders();
    refreshTables();

    if (data?.tenantId && result && !result?.queued) {
      void runCashPaymentHardware(result, { tenantId: data.tenantId, deviceAuth });
    }
  };

  const unlockWaiter = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/tablet/waiter/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...deviceHeaders,
        },
        body: JSON.stringify({
          pin,
          staffId: selectedWaiterId || undefined,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Unlock failed");
      setWaiterSession(payload.sessionToken);
      setPinOpen(false);
      setPin("");
      setView("waiter");
      showToast(`Hello ${payload.staff?.name || "waiter"}`);
    } catch (e) {
      showToast(e.message || "Unlock failed");
    } finally {
      setBusy(false);
    }
  };

  const lockWaiter = () => {
    setWaiterSession(null);
    setView("order");
    showToast("Waiter mode locked.");
  };

  const mergeTables = async () => {
    if (!mergeFrom || !mergeTo) {
      showToast("Pick two tables.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/tablet/tables/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...deviceHeaders,
          ...waiterHeaders,
        },
        body: JSON.stringify({ fromTableId: mergeFrom, toTableId: mergeTo }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Merge failed");
      showToast("Tables merged.");
      refreshTables();
    } catch (e) {
      showToast(e.message || "Merge failed");
    } finally {
      setBusy(false);
    }
  };

  const transferWaiter = async () => {
    if (!transferSession || !transferTarget) {
      showToast("Pick session and target waiter.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/tablet/tables/transfer-waiter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...deviceHeaders,
          ...waiterHeaders,
        },
        body: JSON.stringify({
          sessionId: transferSession,
          newWaiterId: transferTarget,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Transfer failed");
      showToast("Waiter transferred.");
      refreshTables();
    } catch (e) {
      showToast(e.message || "Transfer failed");
    } finally {
      setBusy(false);
    }
  };

  const loadDaySummary = async () => {
    if (!waiterSession) return;
    try {
      const res = await fetch("/api/tablet/reports/summary", {
        cache: "no-store",
        headers: { ...deviceHeaders, ...waiterHeaders },
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok) setDaySummary(payload);
    } catch {
      /* ignore */
    }
  };

  const markServed = async (orderId) => {
    setBusy(true);
    try {
      const res = await fetch("/api/tablet/order/serve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...deviceHeaders,
          ...waiterHeaders,
        },
        body: JSON.stringify({ orderId }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Update failed");
      refreshOrders();
    } catch (e) {
      showToast(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const printThermalOrCopy = (receipt) => {
    if (!receipt) return;
    const raw = buildEscPosReceipt({
      tenantName: receipt.tenantName,
      orderNumber: receipt.orderNumber,
      grandTotal: receipt.grandTotal,
      items: (receipt.items || []).map((it) => ({
        qty: it.qty,
        name: it.name,
        total: it.total,
      })),
    });
    if (typeof window !== "undefined" && window.Capacitor?.Plugins?.Printer) {
      window.Capacitor.Plugins.Printer.print({ data: raw }).catch(() =>
        showToast("Printer plugin not available")
      );
      return;
    }
    void navigator.clipboard?.writeText(raw);
    showToast("Receipt copied (ESC/POS text). Connect a printer plugin for Bluetooth/network.");
  };

  const handlePrintReceiptBrowser = () => {
    if (!lastReceipt) {
      showToast("No receipt yet — complete a payment first.");
      return;
    }
    printReceipt(lastReceipt);
  };

  const floorTables = tablesLive.length ? tablesLive : tables;

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] min-h-0 touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-[#1a202c] via-[#171923] to-[#0f172a] text-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-slate-700/80 bg-[#2d3748] pt-notch-safe shadow-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tableside</p>
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">
              {data?.tenantName || "Restaurant"}{" "}
              <span className="font-normal text-slate-400">· POS</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                liveConnected ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/30" : "bg-amber-500/20 text-amber-100 ring-1 ring-amber-500/30"
              }`}
            >
              {liveConnected ? "● Live" : "Reconnecting…"}
            </span>
            {!waiterSession ? (
              <button
                type="button"
                onClick={() => setPinOpen(true)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 min-h-[44px] active:scale-[0.98]"
              >
                Waiter mode
              </button>
            ) : (
              <button
                type="button"
                onClick={lockWaiter}
                className="rounded-xl border border-slate-500 bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-slate-100 min-h-[44px]"
              >
                Lock waiter
              </button>
            )}
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-nav-safe sm:px-4">
          {["order", "floor", "kitchen", ...(waiterSession ? ["waiter"] : [])].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold min-h-[44px] transition-colors ${
                view === tab
                  ? "bg-[#3182ce] text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-600/50 hover:text-white"
              }`}
            >
              {tab === "order" ? "Menu" : tab === "floor" ? "Floor" : tab === "kitchen" ? "Kitchen" : "Waiter tools"}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden">
        {view === "order" && (
          <div className="flex min-h-0 flex-1 flex-col lg:min-h-0 lg:flex-row lg:gap-0">
            {/* Menu: categories fixed — only product grid scrolls */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div className="shrink-0 border-b border-slate-700/70 bg-[#252b3a]/95 px-3 py-2.5 shadow-sm sm:px-4">
                <div className="flex gap-2 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch]">
                  {categories.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(c.id)}
                      className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold min-h-[44px] transition-all ${
                        selectedCategoryId === c.id ? "text-white shadow-md" : "bg-[#4a5568] text-white hover:bg-[#5a6578]"
                      }`}
                      style={
                        selectedCategoryId === c.id
                          ? { background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }
                          : {}
                      }
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 pb-2 pt-3 sm:px-4">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => openAddonModal(p)}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-600/60 bg-white text-left shadow-md transition hover:border-[#e94560]/50 hover:shadow-lg hover:shadow-[#e94560]/10 active:scale-[0.99]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">
                            🍽
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <div className="line-clamp-2 text-sm font-bold leading-tight text-[#1a1d29]">{p.name}</div>
                        {p.description ? (
                          <div className="mt-1 line-clamp-2 min-h-[2.25em] text-[11px] leading-snug text-slate-500">
                            {p.description}
                          </div>
                        ) : null}
                        <div className="mt-auto pt-2 text-center text-base font-bold text-[#e94560]">
                          {formatEur(p.basePrice)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {filteredProducts.length === 0 ? (
                  <p className="py-12 text-center text-sm text-slate-500">No products in this category.</p>
                ) : null}
              </div>
            </div>

            <aside className="flex w-full shrink-0 flex-col border-t border-slate-600/80 bg-[#1e293b] lg:h-full lg:min-h-0 lg:max-h-full lg:w-[min(100%,380px)] lg:overflow-hidden lg:border-l lg:border-t-0 lg:bg-slate-900/40 lg:[align-self:stretch]">
              <div className="bg-[#3182ce] px-4 py-3 text-white shadow-inner">
                <div className="text-[10px] font-medium uppercase tracking-wide opacity-90">Dine-in</div>
                <div className="text-lg font-bold">Current order</div>
              </div>
              <div className="px-4 py-3">
                <label className="text-xs font-medium text-slate-400">Table</label>
                <select
                  value={selectedTableId || ""}
                  onChange={(e) => setSelectedTableId(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white min-h-[48px]"
                >
                  {floorTables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="max-h-[min(36dvh,260px)] flex-1 space-y-2 overflow-y-auto overscroll-y-contain px-4 sm:max-h-[min(40dvh,300px)] lg:max-h-none lg:min-h-0 lg:flex-1">
                {cart.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">Add items from the menu</p>
                ) : (
                  cart.map((line, idx) => (
                    <div
                      key={`${line.productId}-${idx}`}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-700/80 bg-slate-950/50 px-3 py-2 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-white">
                          {line.quantity}× {line.productName}
                        </div>
                        <div className="text-xs text-slate-500">{formatEur(line.unitPrice)} each</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-lg font-medium text-white"
                          onClick={() => updateQty(idx, -1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-lg font-medium text-white"
                          onClick={() => updateQty(idx, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-1.5 border-t border-slate-700 bg-[#0f172a]/80 px-4 py-3 text-sm text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span>{formatEur(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax (10%)</span>
                  <span>{formatEur(cartTax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-600 pt-2 text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-[#e94560]">{formatEur(cartTotal)}</span>
                </div>
              </div>
              <div className="space-y-2 p-4 pt-2 pb-nav-safe">
                <button
                  type="button"
                  disabled={busy}
                  onClick={openCheckout}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/30 disabled:opacity-50 min-h-[52px] active:scale-[0.99]"
                >
                  Pay & send to kitchen
                </button>
                <p className="text-center text-[11px] leading-snug text-slate-500">
                  Kitchen gets the order after payment (same as web POS). Choose cash, card, or PayPal in the next step.
                </p>
                {lastReceipt ? (
                  <div className="space-y-2 border-t border-slate-700/80 pt-3">
                    <p className="text-center text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      Last sale
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReceiptModalOpen(true)}
                        className="rounded-xl border border-slate-500 bg-slate-800/90 py-3 text-sm font-semibold text-white min-h-[48px] active:scale-[0.99]"
                      >
                        View receipt
                      </button>
                      <button
                        type="button"
                        onClick={handlePrintReceiptBrowser}
                        className="rounded-xl border border-slate-500 bg-slate-800/90 py-3 text-sm font-semibold text-white min-h-[48px] active:scale-[0.99]"
                      >
                        Print
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => printThermalOrCopy(lastReceipt)}
                      className="w-full rounded-xl border border-slate-600 py-2.5 text-xs font-medium text-slate-300 min-h-[44px] active:bg-slate-800"
                    >
                      Thermal printer / copy text
                    </button>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        )}

        {view === "kitchen" && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-nav-safe pt-3 sm:px-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Kitchen display</p>
                <h2 className="text-lg font-bold text-white">Order pipeline</h2>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {kdsBoardOrders.length} active
              </span>
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Same columns as web KDS — bump status, print, or cancel from here.
            </p>
            <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]">
              {KDS_COLUMNS.map((col) => {
                const colOrders = getOrdersForColumn(kdsBoardOrders, col);
                return (
                  <div
                    key={col.id}
                    className="flex w-[min(88vw,300px)] shrink-0 flex-col rounded-2xl border border-slate-700/60 bg-slate-900/40"
                  >
                    <div
                      className="rounded-t-2xl px-3 py-2.5 text-sm font-bold text-white shadow-sm"
                      style={{ background: col.color }}
                    >
                      <span>{col.label}</span>
                      <span className="ml-2 text-xs font-normal opacity-90">({colOrders.length})</span>
                      <div className="text-[10px] font-normal opacity-80">{col.subLabel}</div>
                    </div>
                    <div className="max-h-[min(52dvh,520px)] flex-1 space-y-2 overflow-y-auto overscroll-y-contain p-2 sm:max-h-[min(58dvh,520px)]">
                      {colOrders.length === 0 ? (
                        <p className="px-2 py-8 text-center text-xs text-slate-500">No orders</p>
                      ) : (
                        colOrders.map((order) => (
                          <KDSOrderCard
                            key={order.id}
                            order={order}
                            columnColor={col.color}
                            compact
                            onStatusChange={handleKdsStatusChange}
                            onCancel={openKdsCancelModal}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "floor" && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-4 pb-nav-safe sm:px-4">
            <h2 className="mb-4 text-lg font-bold text-white">Floor plan</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {floorTables.map((t) => {
                const st = String(t.status || "").toUpperCase();
                const bg =
                  st === "OCCUPIED"
                    ? "from-rose-900/50 to-rose-950/80 border-rose-500/50"
                    : st === "RESERVED"
                      ? "from-amber-900/40 to-amber-950/80 border-amber-500/50"
                      : "from-emerald-900/35 to-emerald-950/80 border-emerald-600/40";
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTableId(t.id)}
                    className={`rounded-2xl border bg-gradient-to-br p-4 text-left shadow-lg transition hover:brightness-110 min-h-[104px] ${bg} ${
                      selectedTableId === t.id ? "ring-2 ring-[#3182ce] ring-offset-2 ring-offset-[#171923]" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-lg font-bold text-white">{t.name}</div>
                      <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-200">
                        {st}
                      </span>
                    </div>
                    {t.session ? (
                      <div className="mt-3 text-xs font-medium text-slate-300">Session #{t.session.id}</div>
                    ) : (
                      <div className="mt-3 text-xs text-slate-500">Available</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === "waiter" && waiterSession && (
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-y-contain px-3 pb-nav-safe pt-2 sm:px-4">
          <section className="rounded-2xl border border-slate-800 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-medium text-white">Today (read-only)</h2>
              <button
                type="button"
                onClick={loadDaySummary}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm"
              >
                Refresh summary
              </button>
            </div>
            {daySummary ? (
              <p className="text-sm text-slate-300">
                Orders: {daySummary.orderCount} · Completed: {daySummary.completedCount} · Gross:{" "}
                {money(daySummary.grossSales)}
              </p>
            ) : (
              <p className="text-sm text-slate-500">Tap refresh for branch totals today.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 p-4 space-y-3">
            <h2 className="text-lg font-medium text-white">Merge tables</h2>
            <p className="text-sm text-slate-400">
              Moves active sessions from one table to another.
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={mergeFrom || ""}
                onChange={(e) => setMergeFrom(Number(e.target.value))}
                className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="">From</option>
                {floorTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <span className="text-slate-500">→</span>
              <select
                value={mergeTo || ""}
                onChange={(e) => setMergeTo(Number(e.target.value))}
                className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="">To</option>
                {floorTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={mergeTables}
                disabled={busy}
                className="rounded-lg bg-slate-100 text-slate-900 px-4 py-2 font-medium"
              >
                Merge
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 p-4 space-y-3">
            <h2 className="text-lg font-medium text-white">Transfer waiter</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={transferSession || ""}
                onChange={(e) => setTransferSession(Number(e.target.value))}
                className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="">Session</option>
                {floorTables
                  .filter((t) => t.session)
                  .map((t) => (
                    <option key={t.session.id} value={t.session.id}>
                      {t.name} (#{t.session.id})
                    </option>
                  ))}
              </select>
              <select
                value={transferTarget || ""}
                onChange={(e) => setTransferTarget(Number(e.target.value))}
                className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="">New waiter</option>
                {waiterStaff.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={transferWaiter}
                disabled={busy}
                className="rounded-lg bg-slate-100 text-slate-900 px-4 py-2 font-medium"
              >
                Transfer
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">Active orders</h2>
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 flex flex-wrap justify-between gap-3"
                >
                  <div>
                    <div className="text-white font-medium">
                      {o.orderNumber}{" "}
                      <span className="text-slate-400 text-sm">
                        {o.table?.name ? `· ${o.table.name}` : ""}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {orderStatusLabel(o.status)} · {money(o.grandTotal)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        printThermalOrCopy({
                          tenantName: data?.tenantName || "Restaurant",
                          orderNumber: o.orderNumber,
                          items: (o.orderItems || []).map((i) => ({
                            name: i.productName,
                            qty: i.quantity,
                            total: i.totalAmount,
                          })),
                          grandTotal: o.grandTotal,
                        })
                      }
                      className="rounded-lg border border-slate-600 px-3 py-2 text-sm"
                    >
                      Copy receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => markServed(o.id)}
                      disabled={busy || o.status === "COMPLETED"}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-40"
                    >
                      Mark served
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        )}
      </div>

      {pinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 pt-notch-safe pb-nav-safe">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Waiter PIN</h3>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-600 px-3 py-3 text-lg tracking-widest"
              placeholder="••••"
            />
            {waiterStaff.length > 1 ? (
              <select
                value={selectedWaiterId || ""}
                onChange={(e) => setSelectedWaiterId(Number(e.target.value))}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="">Any waiter</option>
                {waiterStaff.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPinOpen(false);
                  setPin("");
                }}
                className="flex-1 rounded-lg border border-slate-600 py-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={unlockWaiter}
                disabled={busy}
                className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white"
              >
                Unlock
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Set or change this PIN in the admin dashboard: POS &amp; KDS Devices, section Tableside waiter PIN.
            </p>
          </div>
        </div>
      )}

      {addonProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 pt-notch-safe pb-nav-safe">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex gap-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                {addonProduct.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={addonProduct.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-slate-600">🍽</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white">{addonProduct.name}</h3>
                {addonProduct.description ? (
                  <p className="mt-1 line-clamp-3 text-sm text-slate-400">{addonProduct.description}</p>
                ) : null}
                <p className="mt-2 text-base font-bold text-[#e94560]">{formatEur(addonProduct.basePrice)}</p>
              </div>
            </div>
            {addonGroups.map((g) => (
              <div key={g.id}>
                <div className="text-sm text-slate-400 mb-2">{g.name}</div>
                <div className="flex flex-wrap gap-2">
                  {(g.addonItems || []).map((item) => {
                    const selected = (selectedAddons[g.id] || []).some((x) => x.id === item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAddon(g.id, item)}
                        className={`rounded-full px-3 py-2 text-sm ${
                          selected ? "bg-indigo-600 text-white" : "bg-slate-800"
                        }`}
                      >
                        {item.name} (+{money(item.price)})
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddonProduct(null)}
                className="flex-1 rounded-lg border border-slate-600 py-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAddons}
                className="flex-1 rounded-lg bg-emerald-600 py-3 font-medium text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptModalOpen && lastReceipt && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[210] flex items-end justify-center bg-black/65 touch-manipulation sm:items-center sm:p-4"
              style={{
                paddingTop: "max(0.75rem, env(safe-area-inset-top))",
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
              }}
              onClick={() => setReceiptModalOpen(false)}
            >
              <div
                className="flex max-h-[min(92dvh,100dvh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white text-black shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <h2 className="truncate text-lg font-semibold text-slate-900">Receipt</h2>
                  <div className="flex shrink-0 items-center gap-2">
                    {lastReceipt.receiptUrl ? (
                      <a
                        href={lastReceipt.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[#3182ce] underline"
                      >
                        Full page
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setReceiptModalOpen(false)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-white">
                  <Receipt receipt={lastReceipt} embedded />
                </div>
                <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => printThermalOrCopy(lastReceipt)}
                    className="order-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 min-h-[48px] sm:order-1 sm:px-4"
                  >
                    Thermal / copy text
                  </button>
                  <button
                    type="button"
                    onClick={() => printReceipt(lastReceipt)}
                    className="order-1 rounded-xl bg-[#e94560] py-3 text-sm font-semibold text-white min-h-[48px] sm:order-2 sm:px-6"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <POSPaymentModal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        grandTotal={cartTotal}
        cart={cart}
        orderNumber={orderNumber}
        orderType="DINE_IN"
        customerId={walkIn?.id ?? null}
        loyaltyEnabled={loyaltyEnabled}
        loyaltySettings={loyaltySettings}
        customerLoyaltyBalance={walkIn?.loyaltyPoints ?? 0}
        loyaltyCustomerWalkIn={loyaltyCustomerWalkIn}
        deviceAuth={deviceAuth}
        tableId={selectedTableId}
        waiterSession={waiterSession}
        onSuccess={handlePaymentSuccess}
      />

      <KdsCancelOrderModal
        open={kdsCancelModal.open}
        orderNumber={kdsCancelModal.orderNumber}
        reason={kdsCancelReason}
        onReasonChange={setKdsCancelReason}
        onConfirm={handleKdsCancelConfirm}
        onClose={() => {
          if (kdsCancelLoading) return;
          setKdsCancelModal({ open: false, orderId: null, orderNumber: "" });
          setKdsCancelReason("");
          setKdsCancelError("");
        }}
        loading={kdsCancelLoading}
        error={kdsCancelError}
      />

      {toast ? (
        <div
          className="fixed left-1/2 z-50 max-w-[min(100vw-2rem,24rem)] -translate-x-1/2 rounded-full bg-slate-100 px-4 py-2 text-center text-sm text-slate-900 shadow-lg"
          style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
