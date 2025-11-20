import { checkIfStandalone } from "../helpers/checkIfStandalone";
import { getQueryTail } from "../helpers/getQueryTail";
import { getPWAData } from "../helpers/getPWAData";
import { SESSION_ID_KEY } from "../constants/storage";

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

  const baseURL = firstVisit ? destination_url : product_url;
  const tail = getQueryTail();
  // const finalURL = new URL(baseURL, window.location.origin);

  // if (tail) {
  //   const savedParams = new URLSearchParams(tail);
  //   savedParams.forEach((value, key) => {
  //     finalURL.searchParams.set(key, value);
  //   });
  // }

  const sessionId = localStorage.getItem(SESSION_ID_KEY);
  const finalURL = `${baseURL}?${sessionId}&${tail.slice(1)}`;

  console.log("[Redirect] Redirect to:", finalURL);
  console.log("finalURL :", finalURL);

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
