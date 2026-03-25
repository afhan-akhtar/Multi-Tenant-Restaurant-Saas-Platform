"use client";

import Link from "next/link";
import { KDS_COLUMNS, KDSOrderCard, getOrdersForColumn } from "./KDSShared";

export default function DashboardKDSView({
  orders,
  activeFilter,
  setActiveFilter,
  zoom,
  setZoom,
  counts,
  onStatusChange,
  onCancel,
}) {
  return (
    <div className="bg-white flex flex-col h-[calc(100vh-8rem)] min-h-[38rem] rounded-lg overflow-hidden -m-4 sm:-m-6 border border-color-border">
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden p-4">
        <div
          className="grid min-w-[1100px] grid-cols-4 gap-4 h-full"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
        >
          {KDS_COLUMNS.map((column) => {
            const columnOrders = getOrdersForColumn(orders, column, activeFilter);
            return (
              <div key={column.id} className="flex min-h-0 min-w-0 flex-col">
                <div
                  className="rounded-t-lg py-3 px-4 text-white font-semibold shrink-0"
                  style={{ background: column.color }}
                >
                  <div className="text-base">{column.label}</div>
                  <div className="text-xs opacity-90">{column.subLabel}</div>
                  <div className="text-xs mt-0.5">{columnOrders.length} orders</div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto rounded-b-lg border border-color-border border-t-0 bg-color-bg p-3 space-y-3">
                  {columnOrders.map((order) => (
                    <KDSOrderCard
                      key={order.id}
                      order={order}
                      columnColor={column.color}
                      onStatusChange={onStatusChange}
                      onCancel={onCancel}
                    />
                  ))}
                  {columnOrders.length === 0 ? (
                    <div className="py-8 text-center text-color-text-muted text-sm">No orders</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="bg-color-bg border-t border-color-border py-3 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-color-text-muted text-sm">
          <span className="font-medium text-color-text">Kitchen Display</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeFilter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("ACTIVE")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeFilter === "ACTIVE"
                ? "bg-[#3182ce] text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            Active ({counts.createdCount + counts.cookingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("READY")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeFilter === "READY"
                ? "bg-[#3182ce] text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            Ready ({counts.readyCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("DISPATCHED")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeFilter === "DISPATCHED"
                ? "bg-[#64748b] text-white"
                : "bg-white border border-color-border text-color-text-muted hover:text-color-text hover:border-color-text"
            }`}
          >
            Dispatched ({counts.dispatchedCount})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(150, value + 10))}
            className="p-2 rounded bg-white border border-color-border text-color-text-muted hover:text-color-text"
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
            onClick={() => setZoom((value) => Math.max(75, value - 10))}
            className="p-2 rounded bg-white border border-color-border text-color-text-muted hover:text-color-text"
            title="Zoom out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
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
    </div>
  );
}
