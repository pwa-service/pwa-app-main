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

      smartlookClient.init(key, { region: "eu", standalone: true });
      initializedRef.current = true;

      console.log("Smartlook initialized successfully", {
        isWebView: /webview|wv|telegram/i.test(navigator.userAgent),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      const referrer = document.referrer;
      if (referrer) {
        smartlookClient.track("page_load_with_referrer", {
          referrer,
          userAgent: navigator.userAgent,
        });
      }
    } catch (error) {
      console.error("Failed to initialize Smartlook:", error);
      initializedRef.current = false;
    }
  }, [key]);
};
