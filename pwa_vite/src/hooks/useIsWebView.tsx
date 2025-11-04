import { useEffect, useState } from "react";

export const useIsWebView = (): { isWebView: boolean } => {
  const [isWebView, setIsWebView] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

    const userAgent = navigator.userAgent || "";
    const isTelegram = /Telegram/i.test(userAgent);
    const isFacebook = /FBAN|FBAV|FB_IAB|FBSS/i.test(userAgent);
    const isInstagram = /Instagram/i.test(userAgent);
    const isIosWebView = /AppleWebKit(?!.*Safari)/i.test(userAgent);

    const isInWebView =
      /wv|WebView/i.test(userAgent) || isTelegram || isFacebook || isInstagram || isIosWebView;

    setIsWebView(isInWebView);
  }, []);

  return { isWebView };
};
