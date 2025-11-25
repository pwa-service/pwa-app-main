import { checkIfStandalone } from "../helpers/checkIfStandalone";
import { getPWAData } from "../helpers/getPWAData";
import { getQueryTail } from "./getQueryTail";

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
  const tail = await getQueryTail();
  console.log("tail :", tail);

  const baseURL = firstVisit ? destination_url : product_url;
  const finalURL = new URL(baseURL, window.location.origin);

  if (tail) {
    finalURL.search = tail;
  }

  console.log("[Redirect] Redirect to:", finalURL.toString());
  window.location.href = finalURL.toString();
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
