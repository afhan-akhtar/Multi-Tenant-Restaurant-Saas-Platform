"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

const sdkPromiseCache = new Map();

function loadPayPalSdk({ clientId, currency }) {
  const cacheKey = `${clientId}:${currency}`;

  if (sdkPromiseCache.has(cacheKey)) {
    return sdkPromiseCache.get(cacheKey);
  }

  const promise = new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.paypal) {
      resolve(window.paypal);
      return;
    }

    const existing = document.querySelector(`script[data-paypal-sdk="${cacheKey}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () => reject(new Error("Failed to load PayPal SDK.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=${encodeURIComponent(currency)}&intent=capture&components=buttons`;
    script.async = true;
    script.dataset.paypalSdk = cacheKey;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK."));
    document.body.appendChild(script);
  });

  sdkPromiseCache.set(cacheKey, promise);
  return promise;
}

export default function PayPalButtonsSection({
  amount,
  clientId,
  currency,
  checkoutSessionId,
  completedPayment,
  onSuccess,
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = containerRef.current;

    if (!clientId || amount <= 0 || completedPayment || !container) {
      return;
    }

    let cancelled = false;

    async function renderButtons() {
      setLoading(true);
      setError("");

      try {
        const paypal = await loadPayPalSdk({ clientId, currency });
        if (cancelled) return;

        container.innerHTML = "";

        paypal
          .Buttons({
            style: {
              layout: "vertical",
              shape: "rect",
              label: "paypal",
            },
            createOrder: async () => {
              const response = await fetch("/api/payments/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, checkoutSessionId }),
              });
              const data = await response.json().catch(() => ({}));

              if (!response.ok || !data.orderId) {
                throw new Error(data.error || "Failed to create PayPal order.");
              }

              return data.orderId;
            },
            onApprove: async (data) => {
              const response = await fetch("/api/payments/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID, amount }),
              });
              const result = await response.json().catch(() => ({}));

              if (!response.ok || !result.providerPayment) {
                throw new Error(result.error || "Failed to capture PayPal payment.");
              }

              onSuccess?.({
                ...result.providerPayment,
                checkoutSessionId,
              });
            },
            onError: (sdkError) => {
              const message =
                sdkError?.message || "PayPal payment failed. Please try again.";
              setError(message);
            },
          })
          .render(container);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load PayPal.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    renderButtons();

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [amount, clientId, completedPayment, currency, checkoutSessionId, onSuccess]);

  if (amount <= 0) {
    return null;
  }

  if (completedPayment) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="font-medium text-emerald-700">PayPal payment captured</div>
        <div className="mt-1 text-sm text-emerald-700">
          Ref: <span className="font-mono">{completedPayment.providerRef}</span>
        </div>
      </div>
    );
  }

  if (!clientId) {
    return null;
  }

  return (
    <div className="rounded-lg border border-color-border bg-white p-4">
      <div className="font-medium text-color-text">PayPal payment</div>
      <div className="mt-1 text-sm text-color-text-muted">
        Charge {currency} {amount.toFixed(2)}
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-color-text-muted">
          <Spinner size="sm" />
          Loading PayPal
        </div>
      ) : null}

      <div ref={containerRef} className="mt-4 min-h-[44px]" />

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
