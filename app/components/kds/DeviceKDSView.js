"use client";

import { KDS_COLUMNS, KDSOrderCard, getOrdersForColumn } from "./KDSShared";

export default function DeviceKDSView({
  orders,
  activeFilter,
  setActiveFilter,
  zoom,
  setZoom,
  counts,
  onStatusChange,
  onCancel,
  /** When true, fill a parent flex column (e.g. with an offline banner above). */
  nested = false,
}) {
  const rootLayout = nested ? "h-full min-h-0 w-full" : "h-screen w-screen";
  return (
    <div className={`flex ${rootLayout} flex-col overflow-hidden bg-white text-slate-900`}>
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kitchen display</div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Live Orders</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("ACTIVE")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeFilter === "ACTIVE"
                  ? "bg-emerald-500 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              Active ({counts.createdCount + counts.cookingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("READY")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeFilter === "READY"
                  ? "bg-blue-500 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              Ready ({counts.readyCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("DISPATCHED")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeFilter === "DISPATCHED"
                  ? "bg-slate-500 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              Dispatched ({counts.dispatchedCount})
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div
          className="grid min-h-full min-w-[1320px] grid-cols-4 gap-6"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
        >
          {KDS_COLUMNS.map((column) => {
            const columnOrders = getOrdersForColumn(orders, column, activeFilter);
            return (
              <section key={column.id} className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
                <div className="px-5 py-4 text-white" style={{ background: column.color }}>
                  <div className="text-lg font-bold">{column.label}</div>
                  <div className="text-sm opacity-90">{column.subLabel}</div>
                  <div className="mt-1 text-sm font-medium">{columnOrders.length} orders</div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 p-4 space-y-4">
                  {columnOrders.map((order) => (
                    <KDSOrderCard
                      key={order.id}
                      order={order}
                      columnColor={column.color}
                      compact
                      onStatusChange={onStatusChange}
                      onCancel={onCancel}
                    />
                  ))}
                  {columnOrders.length === 0 ? (
                    <div className="flex h-full min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                      No orders
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-1px_0_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-500">Workflow: New, Cooking, Ready, Dispatched</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(150, value + 10))}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Zoom In
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(75, value - 10))}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Zoom Out
            </button>
            <button
              type="button"
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Fullscreen
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
