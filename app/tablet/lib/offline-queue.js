/**
 * Offline-first queue for tablet actions (IndexedDB). Prefix isolates from POS offline keys.
 */
const DB = "tablet_offline_v1";
const STORE = "actions";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export async function enqueueTabletAction(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.add({
      ...record,
      createdAt: Date.now(),
    });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function drainTabletQueue(handler) {
  const db = await openDb();
  const all = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });

  for (const row of all) {
    try {
      await handler(row);
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(row.id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      break;
    }
  }
}
