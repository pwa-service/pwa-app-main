export const useIsWebView = () => {
  if (typeof window === "undefined") {
    return {
      isWebView: false,
    };
  }

  const userAgent = navigator.userAgent || "";

  const isAndroidWebView =
    /Android/i.test(userAgent) &&
    (userAgent.includes("; wv") || userAgent.includes("Version/") || userAgent.includes("WebView"));

  const isTelegramWebView =
    typeof window.TelegramWebview !== "undefined" ||
    typeof window.TelegramWebviewProxy !== "undefined" ||
    userAgent.includes("Telegram");

  const isFacebookWebView = /FBAN|FBAV|FB_IAB|Instagram/i.test(userAgent);

  return {
    isWebView: isAndroidWebView || isTelegramWebView || isFacebookWebView,
  };
};
