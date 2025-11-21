export const idbSet = (key: string, value: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("trackerDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("tracker")) {
        db.createObjectStore("tracker");
      }
    };

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("tracker", "readwrite");
      const store = tx.objectStore("tracker");

      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
};

export const idbGet = (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("trackerDB", 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("tracker", "readonly");
      const store = tx.objectStore("tracker");
      const getReq = store.get(key);

      getReq.onsuccess = () => resolve(getReq.result ?? null);
      getReq.onerror = () => reject(getReq.error);
    };
  });
};
