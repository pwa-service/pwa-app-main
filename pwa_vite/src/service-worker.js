import { precacheAndRoute } from "workbox-precaching";
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = "pwa-launch-cache-v1";
const FIRST_VISIT_FLAG_URL = "/pwa-first-visit";

self.addEventListener("install", () => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "CHECK_FIRST_VISIT") {
    const cache = await caches.open(CACHE_NAME);
    const exists = await cache.match(FIRST_VISIT_FLAG_URL);

    if (!exists) {
      await cache.put(FIRST_VISIT_FLAG_URL, new Response("first-visit", { status: 200 }));

      event.ports[0].postMessage({ firstVisit: true });
    } else {
      event.ports[0].postMessage({ firstVisit: false });
    }
  }
});
