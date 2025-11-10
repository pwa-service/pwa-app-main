import { useEffect, useState } from "react";

export const useIsWebView = (): { isWebView: boolean } => {
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent || "";

    if (userAgent.includes("Android") && typeof window.TelegramWebview !== "undefined") {
      setIsWebView(true);
      return;
    }

    if (
      userAgent.includes("iPhone") &&
      typeof window.TelegramWebviewProxy !== "undefined" &&
      typeof window.TelegramWebviewProxyProto !== "undefined"
    ) {
      setIsWebView(true);
      return;
    }
  }, []);

  return { isWebView };
};
