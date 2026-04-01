"use client";

import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { formatEur } from "@/lib/currencyFormat";
import { getDeviceHeaders } from "@/lib/device-client";
import { dedupeOrderHistoryList } from "@/lib/order-history-dedupe";

const ORDER_HISTORY_LIMIT = 30;

function buildHeaders(deviceAuth) {
  return {
    "Content-Type": "application/json",
    ...getDeviceHeaders(deviceAuth),
  };
}

function formatDay(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

export default function POSRefundModal({
  open,
  onClose,
  deviceAuth = null,
  onSuccess,
}) {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setOrders([]);
      setAnalytics(null);
      setSearch("");
      setError("");
      setSelectedOrderId(null);
      setReason("");
      setConfirmOpen(false);
      return;
    }

    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const [ordersResponse, analyticsResponse] = await Promise.all([
          fetch(
            `/api/orders/history?limit=${ORDER_HISTORY_LIMIT}&search=${encodeURIComponent(search.trim())}`,
            {
              cache: "no-store",
              headers: buildHeaders(deviceAuth),
            }
          ),
          fetch("/api/refunds/analytics", {
            cache: "no-store",
            headers: getDeviceHeaders(deviceAuth),
          }),
        ]);

        const ordersPayload = await ordersResponse.json().catch(() => ({}));
        const analyticsPayload = await analyticsResponse.json().catch(() => ({}));

        if (!ordersResponse.ok) {
          throw new Error(ordersPayload.error || "Failed to load order history.");
        }

        if (!cancelled) {
          const raw = Array.isArray(ordersPayload.orders) ? ordersPayload.orders : [];
          const nextOrders = dedupeOrderHistoryList(raw, ORDER_HISTORY_LIMIT);
          setOrders(nextOrders);
          setAnalytics(analyticsResponse.ok ? analyticsPayload : null);
          setSelectedOrderId((current) => {
            if (current && nextOrders.some((order) => order.id === current)) {
              return current;
            }
            return nextOrders[0]?.id ?? null;
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Failed to load refund data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [deviceAuth, open, search]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const fullRefundAmount = Number(selectedOrder?.refundableAmount || 0);
  const canRefund = fullRefundAmount > 0 && reason.trim().length > 0;

  const hasRefundActivity =
    Number(selectedOrder?.refundedAmount || 0) > 0.001 ||
    (Array.isArray(selectedOrder?.refunds) && selectedOrder.refunds.length > 0);

  const replaceOrder = (updatedOrder) => {
    setOrders((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
    setSelectedOrderId(updatedOrder.id);
    setReason("");
  };

  const submitRefund = async () => {
    if (!selectedOrder) return;

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch("/api/refunds/full", {
        method: "POST",
        headers: buildHeaders(deviceAuth),
        body: JSON.stringify({
          orderId: selectedOrder.id,
          reason: reason.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Refund failed.");
      }

      replaceOrder(result.order);
      setConfirmOpen(false);
      onSuccess?.({
        mode: result.mode,
        refundAmount: result.refundAmount,
        orderNumber: result.order?.orderNumber,
        warning: result.warning || null,
      });
    } catch (submitError) {
      setError(submitError.message || "Refund failed.");
      setConfirmOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[120] bg-black/60 p-4"
        onClick={() => {
          if (!actionLoading) onClose();
        }}
      >
        <div
          className="mx-auto flex h-[90vh] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex w-[360px] shrink-0 flex-col border-r border-slate-200 bg-slate-50">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="text-lg font-semibold text-slate-900">Order History</div>
              <p className="mt-1 text-xs text-slate-500">
                Search recent orders and open the refund flow.
              </p>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order number or ID"
                className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            {analytics ? (
              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 px-5 py-4 text-sm">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="text-xs text-slate-500">Refunded</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formatEur(analytics.totalRefunded || 0)}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="text-xs text-slate-500">Refund records</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {analytics.refundCount || 0}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="px-5 py-8 text-sm text-slate-500">Loading orders…</div>
              ) : null}
              {!loading && orders.length === 0 ? (
                <div className="px-5 py-8 text-sm text-slate-500">No orders found.</div>
              ) : null}
              {!loading &&
                orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full border-b border-slate-200 px-5 py-4 text-left transition ${
                      selectedOrderId === order.id ? "bg-white" : "hover:bg-white/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-900">{order.orderNumber}</div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        {order.status}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {order.customer?.name || "Walk-in"} • {formatDay(order.createdAt)}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Remaining refundable</span>
                      <span className="font-semibold text-emerald-600">
                        {formatEur(order.refundableAmount || 0)}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {selectedOrder ? selectedOrder.orderNumber : "Select an order"}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Refunds are always linked to an existing order and cannot be reversed.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {!selectedOrder ? (
              <div className="flex flex-1 items-center justify-center px-6 text-sm text-slate-500">
                Select an order from the history list to review order details.
              </div>
            ) : (
              <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_340px]">
                <div className="min-h-0 overflow-y-auto px-6 py-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Order total
                      </div>
                      <div className="mt-2 text-xl font-semibold text-slate-900">
                        {formatEur(selectedOrder.totalAmount || 0)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Already refunded
                      </div>
                      <div className="mt-2 text-xl font-semibold text-amber-600">
                        {formatEur(selectedOrder.refundedAmount || 0)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Remaining
                      </div>
                      <div className="mt-2 text-xl font-semibold text-emerald-600">
                        {formatEur(selectedOrder.refundableAmount || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-teal-200/80 bg-teal-50/40 p-4">
                    <div className="text-sm font-semibold text-slate-900">Fiscal receipts (TSE)</div>
                    <p className="mt-1 text-xs text-slate-600">
                      Opens in a new tab. Use{" "}
                      <span className="font-medium">Print → Save as PDF</span> to download.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`/receipt/${selectedOrder.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-teal-600 bg-white px-3 py-2 text-sm font-medium text-teal-800 shadow-sm hover:bg-teal-50"
                      >
                        Original sale receipt
                      </a>
                      {hasRefundActivity ? (
                        <a
                          href={`/receipt/${selectedOrder.id}/storno`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-lg border border-amber-600 bg-white px-3 py-2 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-50"
                        >
                          Refund / Storno receipt
                        </a>
                      ) : null}
                    </div>
                    {!hasRefundActivity ? (
                      <p className="mt-2 text-[11px] text-slate-500">
                        The Storno receipt appears after at least one refund has been recorded (Fiskaly
                        cancellation TSE).
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 text-sm font-semibold text-slate-900">Order items</div>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      {(selectedOrder.items || []).map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 last:border-b-0 ${
                            item.refunded ? "bg-slate-50 opacity-70" : "bg-white"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900">{item.name}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              Qty {item.quantity} • Unit {formatEur(item.price || 0)} • Status {item.status}
                            </div>
                            {item.refunded ? (
                              <div className="mt-2 text-xs font-medium text-amber-600">
                                Already refunded
                              </div>
                            ) : null}
                          </div>
                          <div className="shrink-0 text-sm font-semibold text-slate-900">
                            {formatEur(item.refundableAmount || 0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 text-sm font-semibold text-slate-900">Payments</div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {(selectedOrder.payments || []).map((payment) => (
                        <div key={payment.id} className="rounded-xl border border-slate-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-slate-900">{payment.method}</div>
                            <div className="text-xs uppercase tracking-wide text-slate-500">
                              {payment.status}
                            </div>
                          </div>
                          <div className="mt-3 text-sm text-slate-600">
                            Paid: {formatEur(payment.amount || 0)}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            Refunded: {formatEur(payment.refundedAmount || 0)}
                          </div>
                          <div className="mt-1 text-sm font-medium text-emerald-600">
                            Remaining: {formatEur(payment.refundableAmount || 0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="min-h-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-5 py-5">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">Refund action</div>
                    <div className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                      Amount to refund
                    </div>
                    <div className="mt-1 text-xl font-semibold text-slate-900">
                      {formatEur(fullRefundAmount)}
                    </div>

                    <label className="mt-4 block text-sm font-medium text-slate-700">
                      Reason
                      <textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Explain why this refund is being issued"
                        className="mt-2 min-h-[110px] w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                      />
                    </label>

                    {error ? (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      disabled={!canRefund || actionLoading}
                      onClick={() => setConfirmOpen(true)}
                      className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel order and refund full amount
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">Refund history</div>
                    <div className="mt-4 space-y-3">
                      {(selectedOrder.refunds || []).length === 0 ? (
                        <div className="text-sm text-slate-500">
                          No refunds have been recorded for this order yet.
                        </div>
                      ) : (
                        (selectedOrder.refunds || []).map((refund) => (
                          <div key={refund.id} className="rounded-xl border border-slate-200 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium text-slate-900">
                                {formatEur(refund.amount || 0)}
                              </div>
                              <div className="text-xs uppercase tracking-wide text-slate-500">
                                {refund.paymentMethod || refund.refundType}
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {refund.reason}
                            </div>
                            <div className="mt-2 text-[11px] text-slate-400">
                              {formatDay(refund.createdAt)}
                              {refund.actorName ? ` • ${refund.actorName}` : ""}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Confirm full refund"
        message={`Refund ${formatEur(fullRefundAmount)} and cancel order ${selectedOrder?.orderNumber}? This cannot be undone.`}
        confirmLabel="Refund full order"
        loadingLabel="Processing refund…"
        loading={actionLoading}
        error=""
        overlayClassName="z-[130]"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={submitRefund}
      />
    </>
  );
}
