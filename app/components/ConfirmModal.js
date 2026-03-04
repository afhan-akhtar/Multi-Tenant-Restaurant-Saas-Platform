"use client";

export default function ConfirmModal({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel, loading = false, error }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-sm bg-color-card rounded-xl shadow-xl border border-color-border p-6">
        <h3 className="m-0 mb-2 text-lg font-semibold text-color-text">{title}</h3>
        <p className={`m-0 text-sm text-color-text-muted ${error ? "mb-4" : "mb-6"}`}>{message}</p>
        {error && <p className="m-0 mb-6 text-sm text-red-600">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="py-2 px-4 border border-color-border rounded-lg text-color-text bg-transparent cursor-pointer hover:bg-color-bg disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium border-0 cursor-pointer hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
