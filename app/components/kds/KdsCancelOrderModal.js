"use client";

export default function KdsCancelOrderModal({
  open,
  orderNumber,
  loading = false,
  error = "",
  reason,
  onReasonChange,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-xl border border-color-border bg-color-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="m-0 mb-2 text-lg font-semibold text-color-text">Cancel order</h3>
        <p className="m-0 mb-4 text-sm text-color-text-muted">
          <span className="font-medium text-color-text">{orderNumber}</span>
          {" — "}
          Unpaid tickets are voided from the kitchen only. Paid orders run the same refund as POS (card/online via provider, cash recorded internally).
        </p>

        <label className="mb-4 block text-sm font-medium text-color-text">
          Reason (required)
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-y rounded-lg border border-color-border bg-white px-3 py-2 text-sm"
            placeholder="e.g. Customer left, wrong item fired"
            disabled={loading}
          />
        </label>

        {error ? <p className="m-0 mb-4 text-sm text-red-600">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-color-border px-4 py-2 text-sm text-color-text hover:bg-color-bg disabled:opacity-60"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !reason.trim()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Processing…" : "Confirm cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
