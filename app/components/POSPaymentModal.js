"use client";

import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import StripePaymentSection from "./StripePaymentSection";
import PayPalButtonsSection from "./PayPalButtonsSection";
import { isOnline, queueOrder } from "@/lib/offline";

const METHODS = [
  { id: "CASH", label: "Cash", color: "#22c55e" },
  { id: "CARD", label: "Card (Device)", color: "#64748b" },
  { id: "STRIPE", label: "Stripe", color: "#635bff" },
  { id: "PAYPAL", label: "PayPal", color: "#003087" },
];

const SPLIT_TYPES = [
  { id: "amount", label: "Amount (€)" },
  { id: "percentage", label: "Percent (%)" },
  { id: "quantity", label: "Quantity (weight)" },
];

function round2(n) {
  return Math.round(n * 100) / 100;
}

export default function POSPaymentModal({ open, onClose, grandTotal, cart, orderNumber, orderType, customerId, onSuccess }) {
  const [splits, setSplits] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [cardDeviceStep, setCardDeviceStep] = useState(false);
  const [cardAmount, setCardAmount] = useState(0);
  const [providerStep, setProviderStep] = useState(false);
  const [providerContext, setProviderContext] = useState(null);
  const [providerPayments, setProviderPayments] = useState({});
  const [error, setError] = useState("");

  const hasCardPayment = splits.some((s) => s.method === "CARD" && (Number(s.value) || 0) > 0);
  const hasCapturedProviderPayments = Object.keys(providerPayments).length > 0;

  const resetProviderState = () => {
    setProviderStep(false);
    setProviderContext(null);
    setProviderPayments({});
  };

  const closeModal = () => {
    setCardDeviceStep(false);
    resetProviderState();
    setError("");
    onClose();
  };

  const handleClose = () => {
    if (providerStep && hasCapturedProviderPayments && !loading) {
      setError("Finalize the order to record the captured online payment.");
      return;
    }

    closeModal();
  };

  useEffect(() => {
    if (!open) {
      setCardDeviceStep(false);
      resetProviderState();
      setError("");
      return;
    }

    let cancelled = false;

    async function loadPaymentConfig() {
      setConfigLoading(true);
      try {
        const res = await fetch("/api/payments/config", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to load payment settings.");
        }

        if (!cancelled) {
          setPaymentConfig(data);
        }
      } catch (err) {
        if (!cancelled) {
          setPaymentConfig({
            currency: "EUR",
            mockMode: false,
            providers: {
              stripe: { enabled: false, mode: "disabled", publishableKey: null },
              paypal: { enabled: false, mode: "disabled", clientId: null },
            },
          });
          setError(err.message || "Failed to load payment settings.");
        }
      } finally {
        if (!cancelled) {
          setConfigLoading(false);
        }
      }
    }

    loadPaymentConfig();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!paymentConfig?.providers) return;

    setSplits((prev) =>
      prev.map((split) => {
        if (split.method === "STRIPE" && !paymentConfig.providers.stripe?.enabled) {
          return { ...split, method: "CASH" };
        }

        if (split.method === "PAYPAL" && !paymentConfig.providers.paypal?.enabled) {
          return { ...split, method: "CASH" };
        }

        return split;
      })
    );
  }, [paymentConfig]);

  const total = grandTotal - (Number(discount) || 0);

  const quantityTotal = splits.filter((x) => x.type === "quantity").reduce((s, x) => s + (Number(x.value) || 0), 0);
  const remainingByQuantity = quantityTotal > 0 ? total - splits.filter((x) => x.type !== "quantity").reduce((s, x) => {
    const v = Number(x.value) || 0;
    return s + (x.type === "amount" ? v : (total * v) / 100);
  }, 0) : 0;

  const addSplit = () => {
    setSplits((prev) => [...prev, { method: "CASH", type: "amount", value: "" }]);
  };

  const updateSplit = (idx, field, val) => {
    setSplits((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const removeSplit = (idx) => {
    setSplits((prev) => prev.filter((_, i) => i !== idx));
  };

  const getSplitAmount = (s) => {
    const v = Number(s.value) || 0;
    if (s.type === "amount") return v;
    if (s.type === "percentage") return round2((total * v) / 100);
    if (s.type === "quantity" && quantityTotal > 0) return round2((remainingByQuantity * v) / quantityTotal);
    return 0;
  };

  const resolvedSplits = splits
    .filter((s) => (Number(s.value) || 0) > 0)
    .map((s) => ({
      method: s.method,
      type: "amount",
      value: round2(getSplitAmount(s)),
    }));

  const payFull = () => {
    setSplits([{ method: "CASH", type: "amount", value: String(total) }]);
  };

  const buildPayload = () => {
    if (resolvedSplits.length === 0) {
      return [{ method: "CASH", type: "amount", value: round2(total) }];
    }

    return resolvedSplits;
  };

  const getCardAmount = () =>
    splits
      .filter((s) => s.method === "CARD" && (Number(s.value) || 0) > 0)
      .reduce((sum, s) => sum + getSplitAmount(s), 0);

  const handleConfirmCardDevice = () => {
    setCardDeviceStep(true);
    setCardAmount(getCardAmount());
  };

  const buildCheckoutPayload = (payload, offline) => ({
    items: cart.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      addonItemIds: Array.isArray(i.addons) ? i.addons.map((a) => a.id) : [],
    })),
    orderType: orderType || "TAKEAWAY",
    orderNumber: offline ? undefined : orderNumber,
    customerId: customerId || null,
    splits: payload,
    discountAmount: Number(discount) || 0,
  });

  const getOnlineProviderTotals = (payload) =>
    payload.reduce(
      (totals, split) => {
        if (split.method === "STRIPE") totals.STRIPE = round2(totals.STRIPE + (Number(split.value) || 0));
        if (split.method === "PAYPAL") totals.PAYPAL = round2(totals.PAYPAL + (Number(split.value) || 0));
        return totals;
      },
      { STRIPE: 0, PAYPAL: 0 }
    );

  const submitCheckout = async ({ checkoutPayload, offline, providerPaymentList = [] }) => {
    setError("");
    setLoading(true);

    try {
      if (offline) {
        const queuedId = await queueOrder(checkoutPayload);
        if (queuedId == null) {
          setError("Offline storage unavailable (e.g. private browsing). Please go online or try a different browser.");
          return;
        }
        onSuccess?.({ queued: true, localOrderNumber: orderNumber });
        closeModal();
      } else {
        const res = await fetch("/api/pos/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...checkoutPayload,
            providerPayments: providerPaymentList,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Checkout failed");
        onSuccess?.(data);
        closeModal();
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = buildPayload();

    if (hasCardPayment && !cardDeviceStep) {
      handleConfirmCardDevice();
      return;
    }

    const offline = !isOnline();
    const onlineProviderTotals = getOnlineProviderTotals(payload);
    const hasOnlineOnlyPayment = onlineProviderTotals.STRIPE > 0 || onlineProviderTotals.PAYPAL > 0;
    if (offline && hasOnlineOnlyPayment) {
      setError("Stripe and PayPal require internet. Use Cash or Card (device) when offline.");
      return;
    }

    if (onlineProviderTotals.STRIPE > 0 && !paymentConfig?.providers?.stripe?.enabled) {
      setError("Stripe is not configured. Add the Stripe API keys to enable this payment method.");
      return;
    }

    if (onlineProviderTotals.PAYPAL > 0 && !paymentConfig?.providers?.paypal?.enabled) {
      setError("PayPal is not configured. Add the PayPal API credentials to enable this payment method.");
      return;
    }

    const checkoutPayload = buildCheckoutPayload(payload, offline);

    if (!offline && hasOnlineOnlyPayment) {
      setError("");
      setCardDeviceStep(false);
      setProviderPayments({});
      setProviderContext({
        checkoutPayload,
        onlineProviderTotals,
      });
      setProviderStep(true);
      return;
    }

    await submitCheckout({ checkoutPayload, offline });
  };

  const registerProviderPayment = (payment) => {
    setError("");
    setProviderPayments((prev) => ({
      ...prev,
      [payment.method]: payment,
    }));
  };

  const remaining = round2(total - splits.reduce((s, p) => s + getSplitAmount(p), 0));
  const providerMethodsRequired = Object.entries(providerContext?.onlineProviderTotals || {})
    .filter(([, amount]) => amount > 0)
    .map(([method]) => method);
  const allProvidersComplete =
    providerMethodsRequired.length > 0 &&
    providerMethodsRequired.every((method) => providerPayments[method]?.providerRef);
  const methodOptions = METHODS.map((method) => {
    if (method.id === "STRIPE" && !paymentConfig?.providers?.stripe?.enabled) {
      return { ...method, label: "Stripe (not configured)", disabled: true };
    }

    if (method.id === "PAYPAL" && !paymentConfig?.providers?.paypal?.enabled) {
      return { ...method, label: "PayPal (not configured)", disabled: true };
    }

    if (method.id === "STRIPE" && paymentConfig?.providers?.stripe?.mode === "mock") {
      return { ...method, label: "Stripe (test mode)", disabled: false };
    }

    if (method.id === "PAYPAL" && paymentConfig?.providers?.paypal?.mode === "mock") {
      return { ...method, label: "PayPal (test mode)", disabled: false };
    }

    return { ...method, disabled: false };
  });

  if (!open) return null;

  if (providerStep && providerContext) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
        <div
          className="bg-white rounded-xl max-w-[560px] w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-4 px-6 border-b border-color-border font-semibold text-[1.1rem]">
            Complete online payment
          </div>
          <div className="py-4 px-6 overflow-y-auto flex-1 space-y-4">
            <div className="rounded-lg bg-color-bg p-4 text-sm">
              <div className="flex justify-between">
                <span>Total order</span>
                <span className="font-semibold">
                  {paymentConfig?.currency || "EUR"} {total.toFixed(2)}
                </span>
              </div>
              {providerContext.onlineProviderTotals.STRIPE > 0 ? (
                <div className="mt-2 flex justify-between">
                  <span>Stripe</span>
                  <span>{paymentConfig?.currency || "EUR"} {providerContext.onlineProviderTotals.STRIPE.toFixed(2)}</span>
                </div>
              ) : null}
              {providerContext.onlineProviderTotals.PAYPAL > 0 ? (
                <div className="mt-2 flex justify-between">
                  <span>PayPal</span>
                  <span>{paymentConfig?.currency || "EUR"} {providerContext.onlineProviderTotals.PAYPAL.toFixed(2)}</span>
                </div>
              ) : null}
            </div>

            {providerContext.onlineProviderTotals.STRIPE > 0 ? (
              <StripePaymentSection
                amount={providerContext.onlineProviderTotals.STRIPE}
                currency={paymentConfig?.currency || "EUR"}
                mode={paymentConfig?.providers?.stripe?.mode}
                publishableKey={paymentConfig?.providers?.stripe?.publishableKey}
                completedPayment={providerPayments.STRIPE}
                onSuccess={registerProviderPayment}
              />
            ) : null}

            {providerContext.onlineProviderTotals.PAYPAL > 0 ? (
              <PayPalButtonsSection
                amount={providerContext.onlineProviderTotals.PAYPAL}
                clientId={paymentConfig?.providers?.paypal?.clientId}
                currency={paymentConfig?.currency || "EUR"}
                mode={paymentConfig?.providers?.paypal?.mode}
                completedPayment={providerPayments.PAYPAL}
                onSuccess={registerProviderPayment}
              />
            ) : null}

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>
          <div className="py-4 px-6 border-t border-color-border flex gap-3 justify-end">
            <button
              type="button"
              className="py-2.5 px-5 rounded-lg font-medium border border-color-border bg-white text-color-text hover:bg-color-bg"
              onClick={() => {
                resetProviderState();
                setError("");
              }}
              disabled={hasCapturedProviderPayments || loading}
            >
              Back
            </button>
            <button
              type="button"
              className="py-2.5 px-5 rounded-lg font-medium bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() =>
                submitCheckout({
                  checkoutPayload: providerContext.checkoutPayload,
                  offline: false,
                  providerPaymentList: Object.values(providerPayments),
                })
              }
              disabled={!allProvidersComplete || loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Finalizing…
                </>
              ) : (
                "Finalize Order"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cardDeviceStep) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
        <div
          className="bg-white rounded-xl max-w-[400px] w-full p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="font-semibold text-lg mb-2">Card reader</h3>
            <p className="text-color-text-muted text-sm mb-4">
              Present card to device (tap, insert, or swipe)
            </p>
            <div className="text-2xl font-bold text-primary">€{cardAmount.toFixed(2)}</div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-lg font-medium border border-color-border bg-white"
              onClick={() => setCardDeviceStep(false)}
            >
              Back
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 rounded-lg font-medium bg-primary text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Processing…
                </span>
              ) : (
                "Card payment complete"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-xl max-w-[480px] w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-4 px-6 border-b border-color-border font-semibold text-[1.1rem]">
          Payment
        </div>
        <div className="py-4 px-6 overflow-y-auto flex-1">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-color-text-muted">Total</span>
            <span className="font-bold text-lg">€{total.toFixed(2)}</span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-color-text mb-1">Discount (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full py-2 px-3 border border-color-border rounded-lg"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Split payments</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="py-1.5 px-3 text-sm rounded-lg border border-color-border bg-white hover:bg-color-bg"
                onClick={payFull}
              >
                Pay full (Cash)
              </button>
              <button
                type="button"
                className="py-1.5 px-3 text-sm rounded-lg border border-primary text-primary bg-white hover:bg-primary/5"
                onClick={addSplit}
              >
                + Add split
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[240px] overflow-y-auto">
            {splits.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-end flex-wrap p-2 bg-color-bg rounded-lg">
                <select
                  className="py-2 px-3 border border-color-border rounded-lg text-sm"
                  value={s.method}
                  onChange={(e) => updateSplit(idx, "method", e.target.value)}
                >
                  {methodOptions.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.disabled}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select
                  className="py-2 px-3 border border-color-border rounded-lg text-sm"
                  value={s.type}
                  onChange={(e) => updateSplit(idx, "type", e.target.value)}
                >
                  {SPLIT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step={s.type === "amount" ? 0.01 : 1}
                  min="0"
                  className="flex-1 min-w-[80px] py-2 px-3 border border-color-border rounded-lg text-sm"
                  placeholder={s.type === "amount" ? "€" : s.type === "percentage" ? "%" : "qty"}
                  value={s.value}
                  onChange={(e) => updateSplit(idx, "value", e.target.value)}
                />
                <span className="text-sm font-medium text-color-text-muted">
                  €{getSplitAmount(s).toFixed(2)}
                </span>
                <button
                  type="button"
                  className="py-2 px-2 text-red-500 hover:bg-red-50 rounded-lg"
                  onClick={() => removeSplit(idx)}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {splits.length > 0 && (
            <div className="mt-3 flex justify-between text-sm">
              <span>Allocated</span>
              <span className="font-semibold">€{round2(splits.reduce((s, p) => s + getSplitAmount(p), 0)).toFixed(2)}</span>
            </div>
          )}
          {splits.length > 0 && Math.abs(remaining) > 0.01 && (
            <div className={`mt-1 text-sm ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}>
              {remaining > 0 ? `Remaining: €${remaining.toFixed(2)}` : `Over: €${(-remaining).toFixed(2)}`}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          {configLoading ? (
            <p className="mt-2 text-xs text-color-text-muted">Loading payment provider settings…</p>
          ) : null}
          {paymentConfig?.mockMode ? (
            <p className="mt-2 text-xs text-color-text-muted">
              Stripe and PayPal are running in local test mode. No real provider account is required.
            </p>
          ) : null}
          {!paymentConfig?.mockMode && (!paymentConfig?.providers?.stripe?.enabled || !paymentConfig?.providers?.paypal?.enabled) ? (
            <p className="mt-2 text-xs text-color-text-muted">
              Online methods only appear when their API credentials are configured.
            </p>
          ) : null}
        </div>

        <div className="py-4 px-6 border-t border-color-border flex gap-3 justify-end">
          <button
            type="button"
            className="py-2.5 px-5 rounded-lg font-medium border border-color-border bg-white text-color-text hover:bg-color-bg"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-2.5 px-5 rounded-lg font-medium bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleSubmit}
            disabled={loading || configLoading || (splits.length > 0 && Math.abs(remaining) > 0.02) || total <= 0}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Processing…
              </>
            ) : hasCardPayment ? (
              "Proceed to card reader"
            ) : (
              "Confirm Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
