import { useEffect, useState } from "react";

export const useIsWebView = (): { isWebView: boolean } => {
  const [isWebView, setIsWebView] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const userAgent = window.navigator.userAgent;

    const isAndroidWebView: boolean =
      /\bwv\b/.test(userAgent) || /Version\/[\d.]+.*Chrome\/[.0-9]* Mobile/.test(userAgent);

    const isIosWebView: boolean = /iPhone|iPod|iPad/i.test(userAgent) && !/Safari/i.test(userAgent);

    setIsWebView(isAndroidWebView || isIosWebView);
  }, []);

  return { isWebView };
};
