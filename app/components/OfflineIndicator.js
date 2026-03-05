"use client";

import { useState, useEffect } from "react";
import { isOnline, onConnectionChange, getQueuedCount, syncQueuedOrders } from "@/lib/offline";

export default function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [queuedCount, setQueuedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    const run = async () => {
      const on = isOnline();
      setOnline(on);
      const count = await getQueuedCount();
      setQueuedCount(count);
      if (on && count > 0) {
        setSyncing(true);
        const r = await syncQueuedOrders();
        setQueuedCount(await getQueuedCount());
        setLastSync(r);
        setSyncing(false);
      }
    };
    run();

    const unsub = onConnectionChange((isOn) => {
      setOnline(isOn);
      if (isOn) {
        setSyncing(true);
        syncQueuedOrders()
          .then((r) => {
            setLastSync(r);
            return getQueuedCount();
          })
          .then(setQueuedCount)
          .finally(() => setSyncing(false));
      } else {
        getQueuedCount().then(setQueuedCount);
      }
    });
    return unsub;
  }, []);

  if (online && queuedCount === 0 && !lastSync?.synced) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border text-sm"
      style={{
        background: online ? (queuedCount > 0 ? "#fef3c7" : "#d1fae8") : "#fee2e2",
        borderColor: online ? (queuedCount > 0 ? "#f59e0b" : "#10b981") : "#ef4444",
        color: online ? (queuedCount > 0 ? "#92400e" : "#065f46") : "#991b1b",
      }}
      role="status"
      aria-live="polite"
    >
      {!online ? (
        <>
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Offline — orders will be queued and synced when online</span>
        </>
      ) : syncing ? (
        <>
          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Syncing queued orders…</span>
        </>
      ) : queuedCount > 0 ? (
        <button
          type="button"
          onClick={() => {
            setSyncing(true);
            syncQueuedOrders()
              .then((r) => {
                setLastSync(r);
                return getQueuedCount();
              })
              .then(setQueuedCount)
              .finally(() => setSyncing(false));
          }}
          disabled={syncing}
          className="flex items-center gap-2 text-left hover:opacity-90 disabled:opacity-70"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
          <span>
            {queuedCount} order(s) queued — {lastSync ? "tap to retry sync" : "will sync when online"}
          </span>
        </button>
      ) : lastSync?.synced > 0 ? (
        <>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Synced {lastSync.synced} order(s)</span>
          <button
            type="button"
            onClick={() => setLastSync(null)}
            className="ml-1 text-current/70 hover:text-current"
            aria-label="Dismiss"
          >
            ×
          </button>
        </>
      ) : null}
    </div>
  );
}

export function useOffline() {
  const [online, setOnline] = useState(true);
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    setOnline(isOnline());
    getQueuedCount().then(setQueuedCount);
    const unsub = onConnectionChange((isOn) => {
      setOnline(isOn);
      getQueuedCount().then(setQueuedCount);
    });
    return unsub;
  }, []);

  const refreshQueuedCount = () => getQueuedCount().then(setQueuedCount);

  return { isOnline: online, queuedCount, refreshQueuedCount };
}
