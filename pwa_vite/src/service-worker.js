self.addEventListener("install", () => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", async (event) => {
  const data = event.data;

  if (data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (data?.type === "CHECK_FIRST_VISIT") {
    event.ports[0].postMessage({ firstVisit: true });
  }
});
