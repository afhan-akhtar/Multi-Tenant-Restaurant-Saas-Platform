"use client";

import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "@/app/components/ConfirmModal";
import { getDeviceHeaders } from "@/lib/device-client";
import DashboardKDSView from "@/app/components/kds/DashboardKDSView";
import DeviceKDSView from "@/app/components/kds/DeviceKDSView";
import { getKdsCounts, mergeKdsOrder } from "@/app/components/kds/KDSShared";

export default function KDS({ data, deviceAuth = null, mode = "dashboard" }) {
  const isDeviceMode = mode === "device";
  const initialOrders = useMemo(() => data?.orders || [], [data?.orders]);
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [zoom, setZoom] = useState(100);
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, orderNumber: "" });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [liveConnected, setLiveConnected] = useState(false);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

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
          setOrders((current) => mergeKdsOrder(current, message.payload?.order));
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
  }, [deviceAuth?.wsTicket]);

  useEffect(() => {
    let cancelled = false;

    const syncOrders = async () => {
      try {
        const response = await fetch("/api/kds/live", {
          cache: "no-store",
          headers: getDeviceHeaders(deviceAuth),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !Array.isArray(payload?.orders)) {
          return;
        }

        if (!cancelled) {
          setOrders(payload.orders);
        }
      } catch (error) {
        console.error("KDS live sync failed", error);
      }
    };

    syncOrders();
    const handleWindowFocus = () => {
      syncOrders();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncOrders();
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(syncOrders, liveConnected ? 4000 : 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [deviceAuth, liveConnected]);

  const createdCount = orders.filter((o) => ["OPEN", "CONFIRMED"].includes(o.status)).length;
  const cookingCount = orders.filter((o) => o.status === "PREPARING").length;
  const readyCount = orders.filter((o) => o.status === "READY").length;
  const dispatchedCount = orders.filter((o) => o.status === "PACK").length;

  const getOrdersForColumn = (col) => {
    return orders.filter((o) => col.statuses.includes(o.status));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/kds/order?id=${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getDeviceHeaders(deviceAuth),
        },
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
    setCancelError("");
  };

  const handleCancelConfirm = async () => {
    const { orderId } = cancelModal;
    if (!orderId) return;
    setCancelError("");
    setCancelLoading(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getDeviceHeaders(deviceAuth),
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setCancelModal({ open: false, orderId: null, orderNumber: "" });
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

  return (
    <>
      {isDeviceMode ? <DeviceKDSView {...viewProps} /> : <DashboardKDSView {...viewProps} />}

      <ConfirmModal
        open={cancelModal.open}
        title="Cancel order"
        message={`Cancel order ${cancelModal.orderNumber}? This cannot be undone.`}
        confirmLabel="Yes"
        onConfirm={handleCancelConfirm}
        onCancel={() => { setCancelModal({ open: false, orderId: null, orderNumber: "" }); setCancelError(""); }}
        loading={cancelLoading}
        error={cancelError}
      />
    </>
  );
}
