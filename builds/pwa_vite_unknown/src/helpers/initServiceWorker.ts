export const initServiceWorker = () => {
  if (window !== undefined && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(() => alert("Service Worker registration failed"));
    });
  }
};
