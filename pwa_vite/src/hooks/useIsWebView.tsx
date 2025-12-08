export const useIsWebView = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isWebView: false,
    };
  }

  const userAgent = navigator.userAgent || "";

  const isTelegramWebApp =
    typeof window.Telegram !== "undefined" && typeof window.Telegram.WebApp !== "undefined";

  const isTelegramWebViewAndroid =
    /Android/i.test(userAgent) && typeof window.TelegramWebview !== "undefined";

  const isTelegramWebViewIOS =
    /iPad|iPhone|iPod/.test(userAgent) &&
    typeof window.TelegramWebviewProxy !== "undefined" &&
    typeof window.TelegramWebviewProxyProto !== "undefined";

  return {
    isWebView: isTelegramWebApp || isTelegramWebViewAndroid || isTelegramWebViewIOS,
  };
};
