import { FIRST_VISITE_PWA_KEY, SESSION_ID_KEY } from "../constants/storage";
import { checkIfStandalone } from "../helpers/checkIfStandalone";
import { loadData, saveData } from "../helpers/idbStorage";
import { getQueryTail } from "../helpers/getQueryTail";
import { getPWAData } from "../helpers/getPWAData";
import { postFirstOpen } from "../api/events";

export const redirectOnLaunch = () => {
  if (typeof window === "undefined") return;

  const standalone = window.matchMedia("(display-mode: standalone)");

  const tryRedirect = async () => {
    try {
      if (checkIfStandalone()) await handleRedirect();
    } catch (error) {
      console.error("[Redirect] Error:", error);
    }
  };

  window.addEventListener("pageshow", tryRedirect);

  standalone.addEventListener("change", async (event) => {
    if (event.matches) {
      console.log("[Redirect] Enter standalone (PWA)");
      await tryRedirect();
    }
  });
};

const handleRedirect = async () => {
  const { destination_url, product_url } = getPWAData();

  const firstVisitRaw = await loadData(FIRST_VISITE_PWA_KEY);
  const firstVisit = !firstVisitRaw;
  console.log("[Redirect] first visit:", firstVisit);

  if (firstVisit) {
    await saveData(FIRST_VISITE_PWA_KEY, "visited");
  }

  const baseURL = firstVisit ? destination_url : product_url;
  const finalURL = new URL(baseURL, window.location.origin);

  const queryTail = await getQueryTail();
  console.log("[Redirect] query tail:", queryTail);

  if (firstVisit && queryTail) {
    const sessionID = await loadData(SESSION_ID_KEY);

    try {
      await postFirstOpen(sessionID);
    } catch (err) {
      console.error("[Redirect] postFirstOpen error:", err);
    }

    finalURL.search = queryTail;
  }

  console.log("[Redirect] Redirect to:", finalURL.toString());
  window.location.href = finalURL.toString();
};
