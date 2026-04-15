"use client";

import { useMemo } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromiseCache = new Map();

function getStripePromise(publishableKey) {
  if (!stripePromiseCache.has(publishableKey)) {
    stripePromiseCache.set(publishableKey, loadStripe(publishableKey));
  }
  return stripePromiseCache.get(publishableKey);
}

const cardElementOptions = {
  style: {
    base: {
      color: "#0f172a",
      fontSize: "16px",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};

export function QrMenuStripeProvider({ publishableKey, children }) {
  const stripePromise = useMemo(
    () => (publishableKey ? getStripePromise(publishableKey) : null),
    [publishableKey]
  );
  if (!stripePromise) return children;
  return <Elements stripe={stripePromise}>{children}</Elements>;
}

export function QrMenuPayAndPlaceOrder({
  tenantId,
  tableId,
  cart,
  grandTotal,
  placing,
  setPlacing,
  setError,
  setPlaced,
  setCart,
  storageKey,
  saveCart,
  formatEur,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const payAndOrder = async () => {
    if (!stripe || !elements || !tenantId || !tableId || cart.length === 0 || placing) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    setPlacing(true);
    setError("");
    try {
      const intentRes = await fetch("/api/qr-order/payment-intent", {
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
      const intentJson = await intentRes.json().catch(() => ({}));
      if (!intentRes.ok) throw new Error(intentJson.error || "Could not start payment");

      const { clientSecret, checkoutSessionId } = intentJson;
      if (!clientSecret || !checkoutSessionId) {
        throw new Error("Invalid payment response");
      }

      const payResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (payResult.error) {
        throw new Error(payResult.error.message || "Card payment failed");
      }
      if (payResult.paymentIntent?.status !== "succeeded") {
        throw new Error("Payment was not completed");
      }

      const orderRes = await fetch("/api/qr-order", {
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
          payment_intent_id: payResult.paymentIntent.id,
          checkout_session_id: checkoutSessionId,
        }),
      });
      const orderJson = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) throw new Error(orderJson.error || "Order failed after payment");

      setPlaced({
        orderNumber: orderJson.orderNumber,
        qrClientToken: orderJson.qrClientToken,
        grandTotal: orderJson.grandTotal,
      });
      setCart([]);
      if (storageKey) saveCart(storageKey, []);
    } catch (e) {
      setError(e.message || "Payment or order failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 m-0">
        Pay securely by card. Your order is sent to the kitchen after the payment succeeds.
      </p>
      <div className="rounded-xl border border-slate-200 px-3 py-3 bg-white">
        <CardElement options={cardElementOptions} />
      </div>
      <button
        type="button"
        disabled={placing || !stripe}
        onClick={payAndOrder}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-60"
      >
        {placing ? "Processing…" : `Pay ${formatEur(grandTotal)} & send to kitchen`}
      </button>
    </div>
  );
}
