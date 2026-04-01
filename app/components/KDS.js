"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { getDeviceHeaders } from "@/lib/device-client";
import DashboardKDSView from "@/app/components/kds/DashboardKDSView";
import DeviceKDSView from "@/app/components/kds/DeviceKDSView";
import KdsCancelOrderModal from "@/app/components/kds/KdsCancelOrderModal";
import { dedupeKdsOrders, getKdsCounts, mergeKdsOrder } from "@/app/components/kds/KDSShared";
import {
  buildKdsScopeKey,
  getKdsQueuedActionCount,
  isOnline,
  loadKdsLiveSnapshot,
  onConnectionChange,
  queueKdsCancelAction,
  queueKdsStatusAction,
  saveKdsLiveSnapshot,
  syncKdsQueuedActions,
} from "@/lib/offline";

export default function KDS({ data, deviceAuth = null, mode = "dashboard" }) {
  const isDeviceMode = mode === "device";
  const initialOrders = useMemo(() => dedupeKdsOrders(data?.orders || []), [data?.orders]);
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [zoom, setZoom] = useState(100);
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, orderNumber: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [liveConnected, setLiveConnected] = useState(false);
  const [kdsQueuedCount, setKdsQueuedCount] = useState(0);
  // Must match SSR first paint (server has no navigator); real value applied in useEffect.
  const [browserOnline, setBrowserOnline] = useState(true);

  const kdsScopeKey = useMemo(() => buildKdsScopeKey(deviceAuth), [deviceAuth]);

  const refreshKdsQueueCount = useCallback(() => {
    getKdsQueuedActionCount().then(setKdsQueuedCount);
  }, []);

  useEffect(() => {
    if (isDeviceMode && typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }
    setOrders(initialOrders);
  }, [initialOrders, isDeviceMode]);

  useLayoutEffect(() => {
    if (typeof navigator === "undefined" || navigator.onLine || !kdsScopeKey) return undefined;
    let cancelled = false;
    loadKdsLiveSnapshot(kdsScopeKey).then((cached) => {
      if (cancelled || !cached) return;
      setOrders(dedupeKdsOrders(cached));
    });
    return () => {
      cancelled = true;
    };
  }, [kdsScopeKey]);

  useEffect(() => {
    refreshKdsQueueCount();
  }, [refreshKdsQueueCount]);

  useEffect(() => {
    setBrowserOnline(isOnline());
    return onConnectionChange(setBrowserOnline);
  }, []);

  const syncOrders = useCallback(async () => {
    try {
      if (isOnline()) {
        const pending = await getKdsQueuedActionCount();
        if (pending > 0) {
          await syncKdsQueuedActions(deviceAuth);
          refreshKdsQueueCount();
        }
      }

      const response = await fetch("/api/kds/live", {
        cache: "no-store",
        credentials: "same-origin",
        headers: getDeviceHeaders(deviceAuth),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !Array.isArray(payload?.orders)) {
        return;
      }

      const normalized = dedupeKdsOrders(payload.orders);
      setOrders(normalized);
      if (kdsScopeKey) {
        await saveKdsLiveSnapshot(kdsScopeKey, normalized);
      }
    } catch (error) {
      console.error("KDS live sync failed", error);
    }
  }, [deviceAuth, kdsScopeKey, refreshKdsQueueCount]);

  useEffect(() => {
    if (!deviceAuth?.wsTicket || typeof window === "undefined") {
      return undefined;
    }

    const streamUrl = `/api/kds/stream?ticket=${encodeURIComponent(deviceAuth.wsTicket)}`;
    const source = new EventSource(streamUrl);

    source.onopen = () => {
      setLiveConnected(true);
    };

    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (!message?.event) return;

        if (message.event === "order.created" || message.event === "order.updated" || message.event === "order.cancelled") {
          syncOrders();
        }
      } catch (error) {
        console.error("KDS stream parse failed", error);
      }
    };

    source.onerror = (error) => {
      setLiveConnected(false);
      console.error("KDS live stream error", error);
    };

    return () => {
      setLiveConnected(false);
      source.close();
    };
  }, [deviceAuth?.wsTicket, syncOrders]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await syncOrders();
    };

    run();
    const handleWindowFocus = () => {
      run();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        run();
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(run, liveConnected ? 4000 : 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [syncOrders, liveConnected]);

  useEffect(() => {
    const unsub = onConnectionChange((online) => {
      if (online) {
        syncKdsQueuedActions(deviceAuth).then(() => {
          refreshKdsQueueCount();
          syncOrders();
        });
      }
    });
    return unsub;
  }, [deviceAuth, syncOrders, refreshKdsQueueCount]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!isOnline()) {
      const queuedId = await queueKdsStatusAction(deviceAuth, orderId, newStatus);
      if (queuedId == null) {
        console.error("KDS offline queue unavailable");
        return;
      }
      refreshKdsQueueCount();
      setOrders((current) => {
        const order = current.find((o) => o.id === orderId);
        if (!order) return current;
        return mergeKdsOrder(current, { ...order, status: newStatus });
      });
      return;
    }

    try {
      const res = await fetch(`/api/kds/order?id=${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getDeviceHeaders(deviceAuth),
        },
        credentials: "same-origin",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.order) {
        setOrders((current) => mergeKdsOrder(current, data.order));
      }
    } catch (err) {
      console.error("KDS status update failed", err);
    }
  };

  const openCancelModal = (order) => {
    setCancelModal({ open: true, orderId: order.id, orderNumber: order.orderNumber });
    setCancelReason("");
    setCancelError("");
  };

  const handleCancelConfirm = async () => {
    const { orderId } = cancelModal;
    if (!orderId) return;
    setCancelError("");
    setCancelLoading(true);
    try {
      if (!isOnline()) {
        const queuedId = await queueKdsCancelAction(deviceAuth, orderId, cancelReason);
        if (queuedId == null) {
          throw new Error("Offline storage unavailable. Try again when online.");
        }
        refreshKdsQueueCount();
        setCancelModal({ open: false, orderId: null, orderNumber: "" });
        setCancelReason("");
        setOrders((current) => current.filter((order) => order.id !== orderId));
        return;
      }

      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getDeviceHeaders(deviceAuth),
        },
        credentials: "same-origin",
        body: JSON.stringify({
          orderId,
          reason: cancelReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setCancelModal({ open: false, orderId: null, orderNumber: "" });
      setCancelReason("");
      setOrders((current) => current.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("KDS cancel failed", err);
      setCancelError(err.message || "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  };

  const counts = getKdsCounts(orders);
  const viewProps = {
    orders,
    activeFilter,
    setActiveFilter,
    zoom,
    setZoom,
    counts,
    onStatusChange: handleStatusChange,
    onCancel: openCancelModal,
  };

  const offlineBanner =
    isDeviceMode && (!browserOnline || kdsQueuedCount > 0) ? (
      <div
        className="flex shrink-0 items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-950"
        role="status"
        aria-live="polite"
      >
        {!browserOnline ? (
          <span>Offline — showing saved tickets. Actions queue until you are back online.</span>
        ) : (
          <span>
            {kdsQueuedCount} kitchen action(s) queued — syncing…
          </span>
        )}
      </div>
    ) : null;

  return (
    <>
      {isDeviceMode ? (
        <div className="flex h-screen w-screen flex-col overflow-hidden">
          {offlineBanner}
          <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
            <DeviceKDSView {...viewProps} nested />
          </div>
        </div>
      ) : (
        <DashboardKDSView {...viewProps} />
      )}

      <KdsCancelOrderModal
        open={cancelModal.open}
        orderNumber={cancelModal.orderNumber}
        reason={cancelReason}
        onReasonChange={setCancelReason}
        onConfirm={handleCancelConfirm}
        onClose={() => {
          if (cancelLoading) return;
          setCancelModal({ open: false, orderId: null, orderNumber: "" });
          setCancelReason("");
          setCancelError("");
        }}
        loading={cancelLoading}
        error={cancelError}
      />
    </>
  );
}
