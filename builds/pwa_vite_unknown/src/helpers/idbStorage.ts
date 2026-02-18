const DB_NAME = "pwa_store";
const STORE = "pwa_data";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const saveData = async (key: string, value: string) => {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);

    const req = store.put(value, key);

    req.onsuccess = () => {};
    req.onerror = () => reject(req.error);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const loadData = async (key: string) => {
  const db = await openDB();

  return new Promise<string>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);

    const req = store.get(key);

    req.onsuccess = () => resolve(req.result || "");
    req.onerror = () => reject(req.error);
  });
};
