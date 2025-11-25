import { useEffect } from "react";
import Smartlook from "smartlook-client";

const env = import.meta.env;

export function useSmartLook() {
  const appID = env.VITE_SMARTLOOK_APP_ID;

  useEffect(() => {
    if (typeof window !== "undefined" && appID) {
      if (window.location.pathname === "/") {
        console.log("Smartlook enabled for /");
        console.log(appID);
        Smartlook.init(appID);
      }
    }
  }, [appID]);
}
