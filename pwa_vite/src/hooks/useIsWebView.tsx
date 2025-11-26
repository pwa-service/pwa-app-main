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

  return {
    isWebView: isAndroidWebView || isiOSWebView,
  };
};
