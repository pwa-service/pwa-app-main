export const useIsWebView = () => {
  if (typeof window === "undefined") {
    return {
      isWebView: false,
    };
  }

  const userAgent = navigator.userAgent || "";

  const isTelegramWebView =
    typeof window.TelegramWebview !== "undefined" ||
    typeof window.TelegramWebviewProxy !== "undefined";

  const isFacebookWebView = /FBAN|FBAV|FB_IAB|Instagram/i.test(userAgent);

  return {
    isWebView: isTelegramWebView || isFacebookWebView,
  };
};
