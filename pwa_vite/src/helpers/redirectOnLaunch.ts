import { checkIfStandalone } from "../helpers/checkIfStandalone";
import { getPWAData } from "../helpers/getPWAData";
import { idbGet } from "../helpers/idbStorage";

import { QUERY_TAIL_KEY } from "../constants/storage";

export const redirectOnLaunch = async () => {
  const standalone = window.matchMedia("(display-mode: standalone)");

  window.addEventListener("pageshow", async () => {
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
  await idbGet("dummy").catch(() => {});

  const { destination_url, product_url } = getPWAData();
  const firstVisit = await askServiceWorker();

  const baseURL = firstVisit ? destination_url : product_url;
  const tail = await idbGet(QUERY_TAIL_KEY);

  if (!tail) {
    console.warn("[Redirect] Missing query tail in IndexedDB");
    return;
  }

  const finalURL = `${baseURL}/${tail}`;
  console.log("[Redirect] Redirect to:", finalURL);
  window.location.href = finalURL;
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
