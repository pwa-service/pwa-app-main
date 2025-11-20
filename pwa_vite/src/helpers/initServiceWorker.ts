export const initServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("./service-worker.js")
    .then((registration) => {
      console.log("[init] SW registered:", registration);
    })
    .catch((error) => console.error("[init] SW registration failed:", error));
};
