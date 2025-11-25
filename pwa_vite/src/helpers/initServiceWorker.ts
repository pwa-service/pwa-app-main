import { sendRedirectToSW } from "./sendRedirectToSW";

let pendingRedirectUrl: string | null = null;

const tryRedirect = () => {
  const isInPWA = window.matchMedia("(display-mode: standalone)").matches;

  if (pendingRedirectUrl && isInPWA) {
    console.log("[Main] Performing redirect to:", pendingRedirectUrl);
    window.location.replace(pendingRedirectUrl);
    pendingRedirectUrl = null;
  }
};

export const initServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("./service-worker.js")
    .then((registration) => {
      console.log("[Main] SW registered:", registration);

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "REDIRECT_TO") {
          const redirectUrl = event.data.url;
          console.log("[Main] Received REDIRECT_TO from SW:", redirectUrl);

          pendingRedirectUrl = redirectUrl;
          tryRedirect();
        }
      });

      window.addEventListener("appinstalled", () => {
        console.log("[Main] PWA installed");

        if (pendingRedirectUrl && navigator.serviceWorker.controller) {
          sendRedirectToSW(pendingRedirectUrl);
        }
      });
      console.log("[init] SW registered:", registration);
    })
    .catch((error) => console.error("[Main] SW registration failed:", error));
};
