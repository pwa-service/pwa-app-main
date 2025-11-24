export const initServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("./service-worker.js")
    .then((registration) => {
      console.log("[init] SW registered:", registration);

      if (registration.waiting) {
        console.log("[init] New SW waiting → skipping waiting");
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;

        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("[SW] New version available");
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    })
    .catch((error) => console.error("[init] SW registration failed:", error));
};
