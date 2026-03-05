/**
 * Offline storage & sync for POS resilience (99% uptime SLA).
 * Uses IndexedDB for local storage. Queues orders when offline and syncs when connection is restored.
 */

const DB_NAME = "pos-offline-db";
const DB_VERSION = 1;
const STORE_ORDERS = "queued_orders";
const STORE_META = "meta";

/** Open IndexedDB. Returns null if unavailable (e.g. Safari private mode, SSR). */
function openDB() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => resolve(null);
      req.onsuccess = () => resolve(req.result);
      req.onblocked = () => resolve(null);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_ORDERS)) {
          const os = db.createObjectStore(STORE_ORDERS, { keyPath: "id", autoIncrement: true });
          os.createIndex("status", "status", { unique: false });
          os.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: "key" });
        }
      };
    } catch (err) {
      resolve(null);
    }
  });
}

/** Add order to offline queue. Returns id or null on failure (e.g. Safari private mode). */
export async function queueOrder(payload) {
  try {
    const db = await openDB();
    if (!db) return null;
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ORDERS, "readwrite");
      const store = tx.objectStore(STORE_ORDERS);
      const record = {
        payload: { ...payload },
        status: "PENDING",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const req = store.add(record);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return null;
  }
}

/** Get all pending and failed orders from queue (for sync/retry). Returns [] on failure. */
export async function getQueuedOrders() {
  try {
    const db = await openDB();
    if (!db) return [];
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ORDERS, "readonly");
      const store = tx.objectStore(STORE_ORDERS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result || []).filter((r) => r.status === "PENDING" || r.status === "FAILED");
        list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        resolve(list);
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return [];
  }
}

/** Remove order from queue (after successful sync). No-op on failure. */
export async function removeQueuedOrder(id) {
  try {
    const db = await openDB();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ORDERS, "readwrite");
      const store = tx.objectStore(STORE_ORDERS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // no-op
  }
}

/** Mark order as synced (or failed for conflict). No-op on failure. */
export async function updateQueuedOrderStatus(id, status, serverOrderId = null) {
  try {
    const db = await openDB();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ORDERS, "readwrite");
      const store = tx.objectStore(STORE_ORDERS);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const r = getReq.result;
        if (!r) {
          resolve();
          return;
        }
        r.status = status;
        r.updatedAt = Date.now();
        if (serverOrderId) r.serverOrderId = serverOrderId;
        store.put(r);
      };
      getReq.onerror = () => reject(getReq.error);
      tx.oncomplete = () => db.close();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // no-op
  }
}

/** Sync queued orders to API. Returns { synced: number, failed: number, errors: string[] }. Never throws. */
export async function syncQueuedOrders(checkoutUrl = "/api/pos/checkout") {
  const result = { synced: 0, failed: 0, errors: [] };
  try {
    const queued = await getQueuedOrders();
    for (const record of queued) {
      try {
        const res = await fetch(checkoutUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record.payload),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          await removeQueuedOrder(record.id);
          result.synced++;
        } else {
          result.failed++;
          result.errors.push(data.error || `Order failed: ${res.status}`);
          await updateQueuedOrderStatus(record.id, "FAILED");
        }
      } catch (err) {
        result.failed++;
        result.errors.push(err.message || "Network error");
      }
    }
  } catch {
    // IndexedDB unavailable (e.g. Safari private mode)
  }
  return result;
}

/** Check if browser is online */
export function isOnline() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

/** Subscribe to online/offline events */
export function onConnectionChange(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(navigator.onLine);
  window.addEventListener("online", handler);
  window.addEventListener("offline", handler);
  return () => {
    window.removeEventListener("online", handler);
    window.removeEventListener("offline", handler);
  };
}

/** Get count of pending queued orders. Returns 0 on failure. */
export async function getQueuedCount() {
  try {
    const items = await getQueuedOrders();
    return items.length;
  } catch {
    return 0;
  }
}
