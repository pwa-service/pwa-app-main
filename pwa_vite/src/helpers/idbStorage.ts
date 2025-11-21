let dbPromise: Promise<IDBDatabase> | null = null;

const initDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("trackerDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("tracker")) {
        db.createObjectStore("tracker");
      }
    };

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      resolve(request.result);
    };
  });

  return dbPromise;
};

export const idbSet = async (key: string, value: string): Promise<void> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("tracker", "readwrite");
    const store = tx.objectStore("tracker");

    store.put(value, key);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const idbGet = async (key: string): Promise<string | null> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("tracker", "readonly");
    const store = tx.objectStore("tracker");

    const getReq = store.get(key);

    getReq.onsuccess = () => resolve(getReq.result ?? null);
    getReq.onerror = () => reject(getReq.error);
  });
};
