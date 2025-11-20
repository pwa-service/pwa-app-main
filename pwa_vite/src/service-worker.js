import { precacheAndRoute } from "workbox-precaching";
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("[SW] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  clients.claim();
});

self.addEventListener("message", async (event) => {
  if (event.data?.type === "SET_REDIRECT_URL") {
    redirectUrl = event.data.url;
    console.log("[SW] Received redirect URL:", redirectUrl);

    const allClients = await clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    allClients.forEach((client) => {
      console.log("[SW] Sending REDIRECT_TO to client:", client.id);

      client.postMessage({
        type: "REDIRECT_TO",
        url: redirectUrl,
      });
    });
  }
});
