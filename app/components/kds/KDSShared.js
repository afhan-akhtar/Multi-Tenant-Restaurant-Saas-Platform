"use client";

export const KDS_COLUMNS = [
  {
    id: "CREATED",
    label: "New",
    statuses: ["OPEN", "CONFIRMED"],
    color: "#22c55e",
    subLabel: "Arrived",
  },
  {
    id: "COOKING",
    label: "Cooking",
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
    id: "DISPATCHED",
    label: "Dispatched",
    statuses: ["PACK"],
    color: "#64748b",
    subLabel: "Sent for service",
  },
];

export function formatKdsTime(date) {
  const value = new Date(date);
  return value.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function sortOrdersByCreatedAt(list) {
  return [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function mergeKdsOrder(list, nextOrder) {
  const nextStatus = String(nextOrder?.status || "").toUpperCase();
  if (!nextOrder?.id) {
    return list;
  }

  if (["CANCELLED", "COMPLETED", "REFUNDED"].includes(nextStatus)) {
    return list.filter((order) => order.id !== nextOrder.id);
  }

  const withoutCurrent = list.filter((order) => order.id !== nextOrder.id);
  return sortOrdersByCreatedAt([...withoutCurrent, nextOrder]);
}

export function getKdsCounts(orders) {
  return {
    createdCount: orders.filter((order) => ["OPEN", "CONFIRMED"].includes(order.status)).length,
    cookingCount: orders.filter((order) => order.status === "PREPARING").length,
    readyCount: orders.filter((order) => order.status === "READY").length,
    dispatchedCount: orders.filter((order) => order.status === "PACK").length,
  };
}

export function getOrdersForColumn(orders, column, activeFilter = "ALL") {
  const columnOrders = orders.filter((order) => column.statuses.includes(order.status));

  if (activeFilter === "ALL") return columnOrders;
  if (activeFilter === "ACTIVE") return ["CREATED", "COOKING"].includes(column.id) ? columnOrders : [];
  if (activeFilter === "READY") return column.id === "READY" ? columnOrders : [];
  if (activeFilter === "DISPATCHED") return column.id === "DISPATCHED" ? columnOrders : [];

  return columnOrders;
}

export function KDSOrderCard({ order, columnColor, compact = false, onStatusChange, onCancel }) {
  const customerName = order.customer?.name || "Takeaway";
  const tableName = order.table?.name || "";
  const typeLabel = order.orderType === "DINE_IN" ? (tableName || "Dine-in") : "Takeaway";

  const handlePrintReceipt = () => {
    const accessQuery = order.receiptAccessToken
      ? `?access=${encodeURIComponent(order.receiptAccessToken)}`
      : "";
    window.open(`/receipt/${order.id}${accessQuery}`, "_blank", "noopener,noreferrer");
  };

  const baseCardClass = compact
    ? "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    : "bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm hover:shadow-md transition-all";

  const bodyClass = compact ? "p-4" : "p-3";
  const headingClass = compact ? "text-base font-bold text-slate-900" : "font-bold text-color-text";
  const metaClass = compact ? "text-xs text-slate-500" : "text-xs text-color-text-muted";
  const actionBase = compact ? "rounded-lg px-3 py-2 text-xs font-semibold" : "px-2.5 py-1 rounded text-xs font-medium";

  return (
    <div className={baseCardClass}>
      <div className={compact ? "h-2" : "h-1.5"} style={{ background: columnColor }} />
      <div className={bodyClass}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={headingClass}>{order.orderNumber}</span>
          <div className="flex items-center gap-1.5">
            <span className={metaClass}>{formatKdsTime(order.createdAt)}</span>
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[#3182ce] hover:bg-slate-100"
              title="Print receipt"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              </svg>
            </button>
          </div>
        </div>

        <div className={compact ? "mb-1 text-sm font-semibold text-slate-800" : "text-sm font-medium text-color-text mb-1"}>
          {customerName}
        </div>
        <div className={compact ? "mb-3 text-xs text-slate-500" : "text-xs text-color-text-muted mb-3"}>
          {typeLabel}
        </div>

        <div className="space-y-2">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex min-h-[36px] items-center justify-between gap-2 text-sm py-0.5">
              <span className="min-w-0 flex-1">
                {item.quantity}x {item.productName}
              </span>
            </div>
          ))}
        </div>

        <div className={compact ? "mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-3" : "mt-3 pt-2 border-t border-color-border flex gap-2 flex-wrap"}>
          {columnColor === "#22c55e" && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange?.(order.id, "PREPARING")}
                className={`${actionBase} bg-primary text-white hover:bg-primary-hover`}
              >
                Start Cooking
              </button>
              <button
                type="button"
                onClick={() => onCancel?.(order)}
                className={`${actionBase} bg-red-500 text-white hover:bg-red-600`}
              >
                Cancel
              </button>
            </>
          )}
          {columnColor === "#e94560" && (
            <button
              type="button"
              onClick={() => onStatusChange?.(order.id, "READY")}
              className={`${actionBase} bg-[#3182ce] text-white hover:bg-[#2b6cb0]`}
            >
              Ready
            </button>
          )}
          {columnColor === "#3182ce" && (
            <button
              type="button"
              onClick={() => onStatusChange?.(order.id, "PACK")}
              className={`${actionBase} bg-[#64748b] text-white hover:bg-[#475569]`}
            >
              Dispatch
            </button>
          )}
          {columnColor === "#64748b" && (
            <button
              type="button"
              onClick={() => onStatusChange?.(order.id, "COMPLETED")}
              className={`${actionBase} bg-[#22c55e] text-white hover:bg-[#16a34a]`}
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
