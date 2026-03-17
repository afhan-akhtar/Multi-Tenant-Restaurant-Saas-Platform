"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripeTerminal } from "@stripe/terminal-js";
import Spinner from "./Spinner";

function formatTerminalStatus(status, fallback) {
  if (typeof status === "string" && status.trim()) {
    return status.replace(/_/g, " ");
  }

  return fallback;
}

export default function StripeTerminalSection({
  amount,
  currency,
  terminalConfig,
  checkoutSessionId,
  completedPayment,
  onSuccess,
}) {
  const terminalRef = useRef(null);
  const [sdkLoading, setSdkLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("not_connected");
  const [paymentStatus, setPaymentStatus] = useState("not_ready");
  const [discoveredReaders, setDiscoveredReaders] = useState([]);
  const [selectedReaderIndex, setSelectedReaderIndex] = useState(0);
  const [connectedReader, setConnectedReader] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (completedPayment || amount <= 0 || !terminalConfig?.enabled) {
      return;
    }

    let cancelled = false;

    async function initTerminal() {
      setSdkLoading(true);
      setError("");

      try {
        const StripeTerminal = await loadStripeTerminal();
        if (!StripeTerminal) {
          throw new Error("Stripe Terminal SDK could not be loaded in this environment.");
        }

        const terminal = StripeTerminal.create({
          onFetchConnectionToken: async () => {
            const response = await fetch("/api/payments/stripe/connection-token", {
              method: "POST",
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.secret) {
              throw new Error(data.error || "Failed to fetch Stripe Terminal connection token.");
            }

            return data.secret;
          },
          onUnexpectedReaderDisconnect: () => {
            setConnectedReader(null);
            setConnectionStatus("not_connected");
            setError("Reader disconnected unexpectedly.");
          },
          onConnectionStatusChange: (status) => {
            setConnectionStatus(typeof status === "string" ? status : "not_connected");
          },
          onPaymentStatusChange: (status) => {
            setPaymentStatus(typeof status === "string" ? status : "not_ready");
          },
        });

        if (!cancelled) {
          terminalRef.current = terminal;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to initialize Stripe Terminal.");
        }
      } finally {
        if (!cancelled) {
          setSdkLoading(false);
        }
      }
    }

    initTerminal();

    return () => {
      cancelled = true;
    };
  }, [amount, completedPayment, terminalConfig?.enabled]);

  const handleDiscoverReaders = async () => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    setDiscovering(true);
    setError("");

    try {
      const result = await terminal.discoverReaders({
        simulated: Boolean(terminalConfig?.simulated),
        ...(terminalConfig?.simulated || !terminalConfig?.locationId
          ? {}
          : { location: terminalConfig.locationId }),
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to discover Stripe readers.");
      }

      const readers = result.discoveredReaders || [];
      setDiscoveredReaders(readers);
      setSelectedReaderIndex(0);

      if (readers.length === 0) {
        setError(
          terminalConfig?.simulated
            ? "No simulated reader found."
            : "No Stripe readers found. Check that your reader is online and assigned to the configured location."
        );
      }
    } catch (err) {
      setDiscoveredReaders([]);
      setError(err.message || "Failed to discover Stripe readers.");
    } finally {
      setDiscovering(false);
    }
  };

  const handleConnectReader = async () => {
    const terminal = terminalRef.current;
    const reader = discoveredReaders[selectedReaderIndex];
    if (!terminal || !reader) return;

    setConnecting(true);
    setError("");

    try {
      const result = await terminal.connectReader(reader, { fail_if_in_use: true });
      if (result.error) {
        throw new Error(result.error.message || "Failed to connect Stripe reader.");
      }

      setConnectedReader(result.reader || reader);
    } catch (err) {
      setConnectedReader(null);
      setError(err.message || "Failed to connect Stripe reader.");
    } finally {
      setConnecting(false);
    }
  };

  const handleReaderPayment = async () => {
    const terminal = terminalRef.current;
    if (!terminal || !connectedReader) return;

    setProcessing(true);
    setError("");

    try {
      const intentResponse = await fetch("/api/payments/stripe/create-terminal-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, checkoutSessionId }),
      });
      const intentData = await intentResponse.json().catch(() => ({}));

      if (!intentResponse.ok || !intentData.clientSecret) {
        throw new Error(intentData.error || "Failed to create Stripe Terminal payment intent.");
      }

      if (terminalConfig?.simulated && typeof terminal.setSimulatorConfiguration === "function") {
        await terminal.setSimulatorConfiguration({ testCardNumber: "4242424242424242" });
      }

      const collectResult = await terminal.collectPaymentMethod(intentData.clientSecret, {
        skip_tipping: true,
        enable_customer_cancellation: true,
      });

      if (collectResult.error) {
        throw new Error(collectResult.error.message || "Failed to collect payment on reader.");
      }

      const processResult = await terminal.processPayment(collectResult.paymentIntent);
      if (processResult.error) {
        throw new Error(processResult.error.message || "Failed to process payment on reader.");
      }

      if (processResult.paymentIntent?.status !== "succeeded") {
        throw new Error("Stripe reader payment was not completed.");
      }

      onSuccess?.({
        method: "STRIPE",
        amount,
        providerRef: processResult.paymentIntent.id,
        channel: "reader",
        checkoutSessionId,
      });
    } catch (err) {
      setError(err.message || "Stripe reader payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  if (!terminalConfig?.enabled || amount <= 0) {
    return null;
  }

  if (completedPayment) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="font-medium text-emerald-700">Stripe reader payment captured</div>
        <div className="mt-1 text-sm text-emerald-700">
          Ref: <span className="font-mono">{completedPayment.providerRef}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-color-border bg-white p-4">
      <div className="font-medium text-color-text">Stripe reader payment</div>
      <div className="mt-1 text-sm text-color-text-muted">
        Charge {currency} {amount.toFixed(2)} on a connected Stripe Terminal reader
      </div>

      <div className="mt-4 rounded-lg bg-color-bg p-3 text-sm">
        <div className="flex justify-between gap-3">
          <span>Connection</span>
          <span className="font-medium capitalize">
            {formatTerminalStatus(connectionStatus, "not connected")}
          </span>
        </div>
        <div className="mt-1 flex justify-between gap-3">
          <span>Payment</span>
          <span className="font-medium capitalize">
            {formatTerminalStatus(paymentStatus, "not ready")}
          </span>
        </div>
        <div className="mt-1 flex justify-between gap-3">
          <span>Mode</span>
          <span className="font-medium">
            {terminalConfig.simulated ? "Simulated reader" : "Real reader"}
          </span>
        </div>
      </div>

      {!terminalConfig.simulated && !terminalConfig.locationId ? (
        <p className="mt-3 text-sm text-amber-600">
          Set `STRIPE_TERMINAL_LOCATION_ID` to discover internet readers for this POS.
        </p>
      ) : null}

      {sdkLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-color-text-muted">
          <Spinner size="sm" />
          Loading Stripe Terminal
        </div>
      ) : null}

      {discoveredReaders.length > 0 ? (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-color-text">Discovered readers</label>
          <select
            className="w-full rounded-lg border border-color-border bg-white px-3 py-2 text-sm"
            value={selectedReaderIndex}
            onChange={(e) => setSelectedReaderIndex(Number(e.target.value))}
          >
            {discoveredReaders.map((reader, index) => (
              <option key={reader.id || reader.serial_number || index} value={index}>
                {reader.label || reader.device_type || reader.id}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {connectedReader ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Connected reader: {connectedReader.label || connectedReader.device_type || connectedReader.id}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-color-border bg-white px-4 py-2.5 text-sm font-medium text-color-text disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleDiscoverReaders}
          disabled={sdkLoading || discovering || connecting || processing}
        >
          {discovering ? "Discovering…" : "Discover Readers"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-[#635bff] bg-[#635bff] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleConnectReader}
          disabled={
            sdkLoading ||
            discovering ||
            connecting ||
            processing ||
            discoveredReaders.length === 0 ||
            Boolean(connectedReader)
          }
        >
          {connecting ? "Connecting…" : connectedReader ? "Reader Connected" : "Connect Reader"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleReaderPayment}
          disabled={sdkLoading || discovering || connecting || processing || !connectedReader}
        >
          {processing ? "Charging…" : "Charge Reader"}
        </button>
      </div>
    </div>
  );
}
