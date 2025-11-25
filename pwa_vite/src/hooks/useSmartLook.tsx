import { useEffect } from "react";
import Smartlook from "smartlook-client";

export const useSmartLook = () => {
  const appID = import.meta.env.VITE_SMARTLOOK_APP_ID;

  useEffect(() => {
    if (typeof window !== "undefined" && appID) Smartlook.init(appID);
  }, [appID]);
};
