let dbPromise: Promise<IDBDatabase> | null = null;

export const waitUntilActive = () =>
  new Promise<void>((resolve) => {
    if (document.visibilityState === "visible") {
      resolve();
    } else {
      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.visibilityState === "visible") resolve();
        },
        { once: true }
      );
    }
  });

const initDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    let opened = false;

    const request = indexedDB.open("trackerDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("tracker")) {
        db.createObjectStore("tracker");
      }
    };

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      opened = true;
      resolve(request.result);
    };

    // Safari/Chrome mobile freeze protection hack
    const check = setInterval(() => {
      if (opened) {
        clearInterval(check);
        return;
      }

      if (request.readyState === "done") {
        clearInterval(check);
        resolve(request.result);
      }
    }, 50);
  });

  return dbPromise;
};

// idbSet
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

// idbGet
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
