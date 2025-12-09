import { useRef, useEffect } from "react";
import smartlookClient from "smartlook-client";

export const useSmartLook = () => {
  const key = import.meta.env.VITE_SMARTLOOK_APP_ID;

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!key) {
      console.warn("SmartLook key is not provided");
      return;
    }

    if (initializedRef.current) {
      return;
    }

    try {
      if (typeof window !== "undefined" && window.smartlook) {
        console.log("Smartlook already initialized globally");
        initializedRef.current = true;

        return;
      }

      smartlookClient.init(key);
      initializedRef.current = true;
    } catch (error) {
      console.error("Failed to initialize Smartlook:", error);
      initializedRef.current = false;
    }
  }, [key]);
};
