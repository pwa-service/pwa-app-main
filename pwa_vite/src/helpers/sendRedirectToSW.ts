export const sendRedirectToSW = (url: string) => {
  console.log("[sendRedirectToSW] Sending SET_REDIRECT_URL to SW:", url);

  const sendMessage = (sw: ServiceWorker) => {
    sw.postMessage({ type: "SET_REDIRECT_URL", url });
  };

  if (navigator.serviceWorker.controller) {
    sendMessage(navigator.serviceWorker.controller);
  } else {
    navigator.serviceWorker.addEventListener("controllerchange", function onControllerChange() {
      console.log("[sendRedirectToSW] controllerchange event, sending URL");

      if (navigator.serviceWorker.controller) {
        sendMessage(navigator.serviceWorker.controller);
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      }
    });
  }
};
