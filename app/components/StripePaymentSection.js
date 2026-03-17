"use client";

import { useEffect, useMemo, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Spinner from "./Spinner";
import StripeTerminalSection from "./StripeTerminalSection";

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
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

function StripeCardForm({ amount, currency, checkoutSessionId, completedPayment, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [intent, setIntent] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (completedPayment || amount <= 0) return;

    let cancelled = false;

    async function createIntent() {
      setLoadingIntent(true);
      setError("");

      try {
        const response = await fetch("/api/payments/stripe/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, checkoutSessionId }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Failed to prepare Stripe payment.");
        }

        if (!cancelled) {
          setIntent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setIntent(null);
          setError(err.message || "Failed to prepare Stripe payment.");
        }
      } finally {
        if (!cancelled) {
          setLoadingIntent(false);
        }
      }
    }

    createIntent();

    return () => {
      cancelled = true;
    };
  }, [amount, checkoutSessionId, completedPayment]);

  const handleCharge = async () => {
    if (!stripe || !elements || !intent?.clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    setError("");

    try {
      const result = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Stripe payment failed.");
      }

      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error("Stripe payment was not completed.");
      }

      onSuccess?.({
        method: "STRIPE",
        amount,
        providerRef: result.paymentIntent.id,
        channel: "browser",
        checkoutSessionId,
      });
    } catch (err) {
      setError(err.message || "Stripe payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  if (completedPayment) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="font-medium text-emerald-700">Stripe payment captured</div>
        <div className="mt-1 text-sm text-emerald-700">
          Ref: <span className="font-mono">{completedPayment.providerRef}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-color-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium text-color-text">Stripe card payment</div>
          <div className="text-sm text-color-text-muted">
            Charge {currency} {amount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-color-border px-3 py-3">
        <CardElement options={cardElementOptions} />
      </div>

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#635bff] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleCharge}
        disabled={!stripe || !intent?.clientSecret || loadingIntent || processing}
      >
        {loadingIntent || processing ? (
          <>
            <Spinner size="sm" className="text-white" />
            Processing Stripe
          </>
        ) : (
          "Charge Stripe"
        )}
      </button>
    </div>
  );
}

function StripeBrowserSection({
  amount,
  currency,
  checkoutSessionId,
  publishableKey,
  completedPayment,
  onSuccess,
}) {
  const stripePromise = useMemo(
    () => (publishableKey ? getStripePromise(publishableKey) : null),
    [publishableKey]
  );

  if (amount <= 0) {
    return null;
  }

  if (!publishableKey) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm
        amount={amount}
        currency={currency}
        checkoutSessionId={checkoutSessionId}
        completedPayment={completedPayment}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

export default function StripePaymentSection({
  amount,
  currency,
  checkoutSessionId,
  publishableKey,
  terminalConfig,
  completedPayment,
  onSuccess,
}) {
  const [mode, setMode] = useState("browser");

  useEffect(() => {
    setMode("browser");
  }, [checkoutSessionId]);

  if (amount <= 0) {
    return null;
  }

  const terminalEnabled = Boolean(terminalConfig?.enabled);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-color-border bg-white p-2">
        <div className="mb-2 text-sm font-medium text-color-text">Stripe payment mode</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "browser"
                ? "bg-[#635bff] text-white"
                : "border border-color-border bg-white text-color-text"
            }`}
            onClick={() => setMode("browser")}
          >
            Browser
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "reader"
                ? "bg-[#635bff] text-white"
                : "border border-color-border bg-white text-color-text"
            } disabled:cursor-not-allowed disabled:opacity-60`}
            onClick={() => setMode("reader")}
            disabled={!terminalEnabled}
            title={!terminalEnabled ? "Stripe Terminal requires Stripe to be configured." : undefined}
          >
            Reader
          </button>
        </div>
      </div>

      {mode === "browser" ? (
        <StripeBrowserSection
          amount={amount}
          currency={currency}
          checkoutSessionId={checkoutSessionId}
          publishableKey={publishableKey}
          completedPayment={completedPayment}
          onSuccess={onSuccess}
        />
      ) : (
        <StripeTerminalSection
          amount={amount}
          currency={currency}
          terminalConfig={terminalConfig}
          checkoutSessionId={checkoutSessionId}
          completedPayment={completedPayment}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
