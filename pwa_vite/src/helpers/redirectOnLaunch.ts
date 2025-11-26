import { FIRST_VISITE_PWA_KEY } from "../constants/storage";

import { checkIfStandalone } from "../helpers/checkIfStandalone";
import { loadData, saveData } from "../helpers/idbStorage";
import { getQueryTail } from "../helpers/getQueryTail";
import { getPWAData } from "../helpers/getPWAData";

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
  const { destination_url, product_url } = getPWAData();
  const firstVisitRaw = await loadData(FIRST_VISITE_PWA_KEY);
  const firstVisit = !firstVisitRaw;
  console.log("[Redirect] first visit: ", firstVisit);

  if (firstVisit) {
    await saveData(FIRST_VISITE_PWA_KEY, "visited");
  }

  const baseURL = firstVisit ? destination_url : product_url;
  const finalURL = new URL(baseURL, window.location.origin);

  const queryTail = await getQueryTail();
  console.log("[Redirect] query tail: ", queryTail);

  if (firstVisit && queryTail) {
    finalURL.search = queryTail;
  }

  console.log("[Redirect] Redirect to:", finalURL.toString());
  window.location.href = finalURL.toString();
};
