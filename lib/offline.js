/**
 * Offline storage & sync for POS/KDS (IndexedDB).
 * Queues POS checkouts and KDS actions when offline; syncs when online.
 * Device (no-login) flows persist device headers on each queued row so sync works without cookies.
 */

import { getDeviceHeaders } from "@/lib/device-client";

const DB_NAME = "pos-offline-db";
const DB_VERSION = 2;
const STORE_ORDERS = "queued_orders";
const STORE_META = "meta";
const STORE_KDS_ACTIONS = "kds_queued_actions";

const META_KDS_SNAPSHOT = "kds_live_snapshot";

/** Minimal device credentials for replaying queued API calls (device POS/KDS, no session cookie). */
export function toDeviceSyncForQueue(deviceAuth) {
  if (!deviceAuth?.tenantId || !deviceAuth?.token || !deviceAuth?.deviceType) return null;
  return {
    tenantId: deviceAuth.tenantId,
    token: deviceAuth.token,
    deviceType: String(deviceAuth.deviceType).toUpperCase(),
  };
}

/** Stable scope for KDS IndexedDB snapshot (one cache per device URL or staff branch). */
export function buildKdsScopeKey(deviceAuth) {
  if (!deviceAuth?.tenantId) return "";
  const t = Number(deviceAuth.tenantId);
  if (deviceAuth.token && String(deviceAuth.deviceType || "").toUpperCase() === "KDS") {
    const screen = deviceAuth.screenId ?? "";
    return `kds-device:${t}:${screen}`;
  }
  const b = deviceAuth.branchId ?? "";
  return `kds-staff:${t}:${b}`;
}

function mergeAuthHeaders(recordDeviceSync, fallbackDeviceAuth) {
  const base = { "Content-Type": "application/json" };
  const headers = getDeviceHeaders(recordDeviceSync || fallbackDeviceAuth || null);
  return { ...base, ...headers };
}

function newOfflineCheckoutId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `oc_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

/** Serialize POS queue sync so overlapping online events cannot double-POST the same rows. */
let posSyncQueue = Promise.resolve();

function enqueuePosSync(task) {
  const next = posSyncQueue.then(() => task());
  posSyncQueue = next.catch(() => {});
  return next;
}

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
        if (!db.objectStoreNames.contains(STORE_KDS_ACTIONS)) {
          const kds = db.createObjectStore(STORE_KDS_ACTIONS, { keyPath: "id", autoIncrement: true });
          kds.createIndex("syncStatus", "syncStatus", { unique: false });
          kds.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Add order to offline queue. Pass deviceAuth for device POS so sync can authenticate.
 * Returns id or null on failure (e.g. Safari private mode).
 */
export async function queueOrder(payload, deviceAuth = null) {
  try {
    const db = await openDB();
    if (!db) return null;
    const deviceSync = toDeviceSyncForQueue(deviceAuth);
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ORDERS, "readwrite");
      const store = tx.objectStore(STORE_ORDERS);
      const offlineCheckoutId =
        typeof payload?.offlineCheckoutId === "string" && payload.offlineCheckoutId.trim().length >= 8
          ? payload.offlineCheckoutId.trim().slice(0, 64)
          : newOfflineCheckoutId();
      const record = {
        payload: { ...payload, offlineCheckoutId },
        deviceSync,
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

/** Get all pending and failed POS orders from queue. Returns [] on failure. */
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

/** Remove POS order from queue (after successful sync). No-op on failure. */
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

/** Mark POS queued order status. No-op on failure. */
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

/**
 * Sync queued POS checkouts. Pass deviceAuth for rows queued before deviceSync was stored, or as fallback.
 * Staff dashboard: omit deviceAuth (session cookies apply).
 */
export async function syncQueuedOrders(checkoutUrl = "/api/pos/checkout", options = {}) {
  const { deviceAuth = null } = options;
  return enqueuePosSync(async () => {
    const result = { synced: 0, failed: 0, errors: [] };
    try {
      const queued = await getQueuedOrders();
      for (const record of queued) {
        try {
          const headers = mergeAuthHeaders(record.deviceSync, deviceAuth);
          const res = await fetch(checkoutUrl, {
            method: "POST",
            headers,
            credentials: "same-origin",
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
      // IndexedDB unavailable
    }
    return result;
  });
}

export async function saveKdsLiveSnapshot(scopeKey, orders) {
  if (!scopeKey || !Array.isArray(orders)) return;
  try {
    const db = await openDB();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, "readwrite");
      const store = tx.objectStore(STORE_META);
      store.put({
        key: META_KDS_SNAPSHOT,
        scopeKey,
        orders,
        savedAt: Date.now(),
      });
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // no-op
  }
}

/** @returns {Promise<object[]|null>} orders or null if missing / wrong scope */
export async function loadKdsLiveSnapshot(expectedScopeKey) {
  if (!expectedScopeKey) return null;
  try {
    const db = await openDB();
    if (!db) return null;
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, "readonly");
      const store = tx.objectStore(STORE_META);
      const req = store.get(META_KDS_SNAPSHOT);
      req.onsuccess = () => {
        const row = req.result;
        if (!row || row.scopeKey !== expectedScopeKey || !Array.isArray(row.orders)) {
          resolve(null);
          return;
        }
        resolve(row.orders);
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return null;
  }
}

async function getAllKdsActionRecords() {
  const db = await openDB();
  if (!db) return [];
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_KDS_ACTIONS, "readonly");
    const store = tx.objectStore(STORE_KDS_ACTIONS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getKdsQueuedActions() {
  try {
    const list = await getAllKdsActionRecords();
    const pending = list.filter((r) => r.syncStatus === "PENDING" || r.syncStatus === "FAILED");
    pending.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    return pending;
  } catch {
    return [];
  }
}

async function removeKdsQueuedAction(id) {
  const db = await openDB();
  if (!db) return;
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_KDS_ACTIONS, "readwrite");
    tx.objectStore(STORE_KDS_ACTIONS).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

async function updateKdsActionSyncStatus(id, syncStatus) {
  const db = await openDB();
  if (!db) return;
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_KDS_ACTIONS, "readwrite");
    const store = tx.objectStore(STORE_KDS_ACTIONS);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const r = getReq.result;
      if (!r) {
        resolve();
        return;
      }
      r.syncStatus = syncStatus;
      r.updatedAt = Date.now();
      store.put(r);
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

/** Remove pending STATUS actions for the same order so only the latest transition is synced. */
async function deletePendingKdsStatusActionsForOrder(orderId) {
  const db = await openDB();
  if (!db) return;
  const all = await getAllKdsActionRecords();
  const toDelete = all.filter(
    (r) => r.kind === "STATUS" && r.orderId === orderId && r.syncStatus === "PENDING"
  );
  if (!toDelete.length) return;
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_KDS_ACTIONS, "readwrite");
    const store = tx.objectStore(STORE_KDS_ACTIONS);
    for (const r of toDelete) {
      store.delete(r.id);
    }
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Queue a KDS status PATCH for offline sync. Coalesces multiple pending STATUS rows per order.
 */
export async function queueKdsStatusAction(deviceAuth, orderId, orderStatus) {
  try {
    const deviceSync = toDeviceSyncForQueue(deviceAuth);
    await deletePendingKdsStatusActionsForOrder(orderId);
    const db = await openDB();
    if (!db) return null;
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_KDS_ACTIONS, "readwrite");
      const store = tx.objectStore(STORE_KDS_ACTIONS);
      const record = {
        kind: "STATUS",
        orderId,
        orderStatus,
        deviceSync,
        syncStatus: "PENDING",
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

/** Queue kitchen cancel for offline sync. */
export async function queueKdsCancelAction(deviceAuth, orderId, reason) {
  try {
    const deviceSync = toDeviceSyncForQueue(deviceAuth);
    const db = await openDB();
    if (!db) return null;
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_KDS_ACTIONS, "readwrite");
      const store = tx.objectStore(STORE_KDS_ACTIONS);
      const record = {
        kind: "CANCEL",
        orderId,
        reason: String(reason || "").trim(),
        deviceSync,
        syncStatus: "PENDING",
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

export async function getKdsQueuedActionCount() {
  try {
    const items = await getKdsQueuedActions();
    return items.length;
  } catch {
    return 0;
  }
}

/**
 * Replay queued KDS actions. Uses each row's deviceSync; staff rows use session cookies.
 * @param {object|null} deviceAuth fallback headers when a legacy row has no deviceSync
 */
export async function syncKdsQueuedActions(deviceAuth = null) {
  const result = { synced: 0, failed: 0, errors: [] };
  try {
    const queued = await getKdsQueuedActions();
    for (const record of queued) {
      try {
        const headers = mergeAuthHeaders(record.deviceSync, deviceAuth);
        if (record.kind === "STATUS") {
          const res = await fetch(`/api/kds/order?id=${record.orderId}`, {
            method: "PATCH",
            headers,
            credentials: "same-origin",
            body: JSON.stringify({ status: record.orderStatus }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            await removeKdsQueuedAction(record.id);
            result.synced++;
          } else {
            result.failed++;
            result.errors.push(data.error || `KDS update failed: ${res.status}`);
            await updateKdsActionSyncStatus(record.id, "FAILED");
          }
        } else if (record.kind === "CANCEL") {
          const res = await fetch("/api/orders/cancel", {
            method: "POST",
            headers,
            credentials: "same-origin",
            body: JSON.stringify({
              orderId: record.orderId,
              reason: record.reason,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            await removeKdsQueuedAction(record.id);
            result.synced++;
          } else {
            result.failed++;
            result.errors.push(data.error || `Cancel failed: ${res.status}`);
            await updateKdsActionSyncStatus(record.id, "FAILED");
          }
        }
      } catch (err) {
        result.failed++;
        result.errors.push(err.message || "Network error");
        await updateKdsActionSyncStatus(record.id, "FAILED");
      }
    }
  } catch {
    // no-op
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

/** Get count of pending POS queued orders. Returns 0 on failure. */
export async function getQueuedCount() {
  try {
    const items = await getQueuedOrders();
    return items.length;
  } catch {
    return 0;
  }
}
