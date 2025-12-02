export const useIsWebView = () => {
  if (typeof window === "undefined") {
    return {
      isWebView: false,
    };
  }

  const userAgent = navigator.userAgent || "";

  const isAndroidWebView =
    userAgent.includes("Android") && typeof window.TelegramWebview !== "undefined";

  const isiOSWebView =
    /iPad|iPhone|iPod/.test(userAgent) &&
    typeof window.TelegramWebviewProxy !== "undefined" &&
    typeof window.TelegramWebviewProxyProto !== "undefined";

  const isFacebookWebView = /FBAN|FBAV|FB_IAB/i.test(userAgent);

  return {
    isWebView: isAndroidWebView || isiOSWebView || isFacebookWebView,
  };
};
