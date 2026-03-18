"use client";

import { useEffect, useMemo, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

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

function SubscriptionCardForm({ invoiceId, invoiceNumber, amount, publishableKey }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const checkoutSessionId = useMemo(
    () => `subscription-${invoiceId}-${Date.now()}`,
    [invoiceId]
  );
  const [intent, setIntent] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function createIntent() {
      setLoadingIntent(true);
      setError("");
      setSuccess("");

      try {
        const response = await fetch("/api/subscription/payments/stripe/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId, checkoutSessionId }),
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
  }, [invoiceId, checkoutSessionId]);

  async function handlePayment() {
    if (!stripe || !elements || !intent?.clientSecret) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

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

      const finalizeResponse = await fetch("/api/subscription/payments/stripe/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          paymentIntentId: result.paymentIntent.id,
          checkoutSessionId,
        }),
      });
      const finalizeData = await finalizeResponse.json().catch(() => ({}));

      if (!finalizeResponse.ok) {
        throw new Error(finalizeData.error || "Failed to record invoice payment.");
      }

      setSuccess(`Payment recorded for ${invoiceNumber}.`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Stripe payment failed.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-lg border border-color-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium text-color-text">Pay outstanding invoice</div>
          <div className="text-sm text-color-text-muted">
            {invoiceNumber} • EUR {amount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-color-border px-3 py-3">
        <CardElement options={cardElementOptions} />
      </div>

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-emerald-600">{success}</p> : null}

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#635bff] px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handlePayment}
        disabled={!publishableKey || !stripe || !intent?.clientSecret || loadingIntent || processing}
      >
        {loadingIntent || processing ? (
          <>
            <Spinner size="sm" className="text-white" />
            Processing Stripe
          </>
        ) : (
          "Pay with Stripe card"
        )}
      </button>
    </div>
  );
}

export default function SubscriptionStripePaymentCard({ invoiceId, invoiceNumber, amount }) {
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [configError, setConfigError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const response = await fetch("/api/payments/config");
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Failed to load payment configuration.");
        }

        if (!cancelled) {
          setPaymentConfig(data);
        }
      } catch (err) {
        if (!cancelled) {
          setConfigError(err.message || "Failed to load payment configuration.");
        }
      }
    }

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const publishableKey = paymentConfig?.providers?.stripe?.publishableKey || null;
  const stripePromise = useMemo(
    () => (publishableKey ? getStripePromise(publishableKey) : null),
    [publishableKey]
  );

  if (configError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {configError}
      </div>
    );
  }

  if (!paymentConfig) {
    return (
      <div className="rounded-lg border border-color-border bg-white px-4 py-4 text-sm text-color-text-muted">
        Loading Stripe payment form…
      </div>
    );
  }

  if (!paymentConfig?.providers?.stripe?.enabled || !publishableKey) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Stripe browser payments are not configured for subscription billing yet.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <SubscriptionCardForm
        invoiceId={invoiceId}
        invoiceNumber={invoiceNumber}
        amount={Number(amount || 0)}
        publishableKey={publishableKey}
      />
    </Elements>
  );
}
