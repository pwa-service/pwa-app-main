import { precacheAndRoute } from "workbox-precaching";
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(self.clients.claim());
});
