import { checkIfStandalone } from "../helpers/checkIfStandalone";
import { getPWAData } from "../helpers/getPWAData";

export const redirectOnLaunch = async () => {
  const standalone = window.matchMedia("(display-mode: standalone)");

  window.addEventListener("pageshow", async (event) => {
    console.log("[Redirect] pageshow triggered", {
      persisted: event.persisted,
    });

    if (!checkIfStandalone()) return;

    await handleRedirect();
  });

  standalone.addEventListener("change", async (event) => {
    if (event.matches) {
      console.log("[Redirect] Enter standalone (PWA)");
      await handleRedirect();
    }
  });
};

const handleRedirect = async () => {
  const { destination_url, product_url } = getPWAData();

  const firstVisit = await askServiceWorker();
  const targetURL = firstVisit ? destination_url : product_url;

  console.log("[Redirect] Redirect to:", targetURL);

  window.location.href = targetURL;
};

const askServiceWorker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) {
      resolve(true);
      return;
    }

    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.firstVisit);
    };

    navigator.serviceWorker.controller.postMessage({ type: "CHECK_FIRST_VISIT" }, [
      messageChannel.port2,
    ]);
  });
};
