"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";

const COLUMNS = [
  {
    id: "NEW",
    label: "New",
    statuses: ["OPEN", "CONFIRMED"],
    color: "#22c55e",
    subLabel: "Arrived",
  },
  {
    id: "PREPARING",
    label: "Preparing",
    statuses: ["PREPARING"],
    color: "#e94560",
    subLabel: "In kitchen",
  },
  {
    id: "READY",
    label: "Ready",
    statuses: ["READY"],
    color: "#3182ce",
    subLabel: "Ready for pickup",
  },
  {
    id: "PACK",
    label: "Pack",
    statuses: ["PACK"],
    color: "#64748b",
    subLabel: "Service complete",
  },
];

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function OrderCard({ order, columnColor, onStatusChange, onCancel }) {
  const customerName = order.customer?.name || "Takeaway";
  const tableName = order.table?.name || "";
  const typeLabel = order.orderType === "DINE_IN" ? (tableName || "Dine-in") : "Takeaway";

  const handlePrintReceipt = () => {
    window.open(`/receipt/${order.id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="h-1.5" style={{ background: columnColor }} />
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-bold text-color-text">{order.orderNumber}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-color-text-muted">{formatTime(order.createdAt)}</span>
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-color-bg text-[#3182ce] cursor-pointer shrink-0"
              title="Print receipt"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              </svg>
            </button>
          </div>
        </div>
        <div className="text-sm font-medium text-color-text mb-1">{customerName}</div>
        <div className="text-xs text-color-text-muted mb-3">{typeLabel}</div>
        <div className="space-y-2">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 text-sm min-h-[36px] py-0.5">
              <span className="flex-1 min-w-0">
                {item.quantity}× {item.productName}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded hover:bg-red-50 text-color-text-muted hover:text-red-600 cursor-pointer text-xs shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex items-center justify-center w-8 h-8 rounded hover:bg-color-bg text-[#3182ce] cursor-pointer shrink-0"
                  title="Print receipt"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-color-border flex gap-2 flex-wrap">
          {columnColor === "#22c55e" && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange?.(order.id, "PREPARING")}
                className="px-2.5 py-1 rounded text-xs font-medium bg-primary text-white hover:bg-primary-hover cursor-pointer"
              >
                Start
              </button>
              <button
                type="button"
                onClick={() => onCancel?.(order)}
                className="px-2.5 py-1 rounded text-xs font-medium bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
          {columnColor === "#e94560" && (
            <button
              type="button"
              onClick={() => onStatusChange?.(order.id, "READY")}
              className="px-2.5 py-1 rounded text-xs font-medium bg-[#3182ce] text-white hover:bg-[#2b6cb0] cursor-pointer"
            >
              Ready
            </button>
          )}
          {columnColor === "#3182ce" && (
            <button
              type="button"
              onClick={() => onStatusChange?.(order.id, "PACK")}
              className="px-2.5 py-1 rounded text-xs font-medium bg-[#64748b] text-white hover:bg-[#475569] cursor-pointer"
            >
              Pack
            </button>
          )}
          {columnColor === "#64748b" && (
            <button
              type="button"
              onClick={() => onStatusChange?.(order.id, "COMPLETED")}
              className="px-2.5 py-1 rounded text-xs font-medium bg-[#22c55e] text-white hover:bg-[#16a34a] cursor-pointer"
            >
              Service Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KDS({ data }) {
  const router = useRouter();
  const orders = data?.orders || [];
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [zoom, setZoom] = useState(100);
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, orderNumber: "" });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const newCount = orders.filter((o) => ["OPEN", "CONFIRMED"].includes(o.status)).length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING").length;
  const readyCount = orders.filter((o) => o.status === "READY").length;
  const packCount = orders.filter((o) => o.status === "PACK").length;

  const getOrdersForColumn = (col) => {
    return orders.filter((o) => col.statuses.includes(o.status));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/kds/order?id=${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
    } catch (err) {
      console.error("KDS status update failed", err);
    }
  };

  const openCancelModal = (order) => {
    setCancelModal({ open: true, orderId: order.id, orderNumber: order.orderNumber });
    setCancelError("");
  };

  const handleCancelConfirm = async () => {
    const { orderId } = cancelModal;
    if (!orderId) return;
    setCancelError("");
    setCancelLoading(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setCancelModal({ open: false, orderId: null, orderNumber: "" });
      router.refresh();
    } catch (err) {
      console.error("KDS cancel failed", err);
      setCancelError(err.message || "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col min-h-[calc(100vh-8rem)] rounded-lg overflow-hidden -m-4 sm:-m-6 border border-color-border">
      <div className="flex-1 overflow-hidden p-4">
        <div className="grid grid-cols-4 gap-4 h-full" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col min-w-0">
              <div
                className="py-3 px-4 rounded-t-lg text-white font-semibold shrink-0"
                style={{ background: col.color }}
              >
                <div className="text-base">{col.label}</div>
                <div className="text-xs opacity-90">{col.subLabel}</div>
                <div className="text-xs mt-0.5">{getOrdersForColumn(col).length} orders</div>
              </div>
              <div className="flex-1 overflow-y-auto bg-color-bg rounded-b-lg p-3 space-y-3 border border-color-border border-t-0">
                {getOrdersForColumn(col).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    columnColor={col.color}
                    onStatusChange={handleStatusChange}
                    onCancel={(order) => openCancelModal(order)}
                  />
                ))}
                {getOrdersForColumn(col).length === 0 && (
                  <div className="py-8 text-center text-color-text-muted text-sm">No orders</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-color-bg border-t border-color-border py-3 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-color-text-muted text-sm">
          <span className="font-medium text-color-text">Kitchen Display</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveFilter("PACK")}
            className={`px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${
              activeFilter === "PACK"
                ? "bg-[#64748b] text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            Pack ({packCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("ACTIVE")}
            className={`px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${
              activeFilter === "ACTIVE"
                ? "bg-[#3182ce] text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            Active ({newCount + preparingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("READY")}
            className={`px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${
              activeFilter === "READY"
                ? "bg-[#64748b] text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            Ready ({readyCount})
          </button>
          <span className="text-color-text-muted text-sm">Service complete</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-2 rounded bg-white border border-color-border text-color-text-muted hover:text-color-text cursor-pointer"
            title="Zoom in"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(75, z - 10))}
            className="p-2 rounded bg-white border border-color-border text-color-text-muted hover:text-color-text cursor-pointer"
            title="Zoom out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="p-2 rounded bg-white border border-color-border text-color-text-muted hover:text-color-text cursor-pointer"
            title="Fullscreen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 py-2 px-3 rounded bg-white border border-color-border text-color-text-muted hover:text-color-text text-sm font-medium no-underline"
            title="Exit to Dashboard"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Exit
          </Link>
        </div>
      </footer>

      <ConfirmModal
        open={cancelModal.open}
        title="Cancel order"
        message={`Cancel order ${cancelModal.orderNumber}? This cannot be undone.`}
        confirmLabel="Yes"
        onConfirm={handleCancelConfirm}
        onCancel={() => { setCancelModal({ open: false, orderId: null, orderNumber: "" }); setCancelError(""); }}
        loading={cancelLoading}
        error={cancelError}
      />
    </div>
  );
}
