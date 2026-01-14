export const detectWebView = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent || "";

  const isFacebookWebView =
    userAgent.includes("FBAN") || userAgent.includes("FBAV") || userAgent.includes("Instagram");

  const isTelegramWebApp =
    typeof window.Telegram !== "undefined" && typeof window.Telegram.WebApp !== "undefined";

  const isTelegramWebViewAndroid =
    /Android/i.test(userAgent) && typeof window.TelegramWebview !== "undefined";

  const isTelegramWebViewIOS =
    /iPad|iPhone|iPod/.test(userAgent) &&
    typeof window.TelegramWebviewProxy !== "undefined" &&
    typeof window.TelegramWebviewProxyProto !== "undefined";

  return isFacebookWebView || isTelegramWebApp || isTelegramWebViewAndroid || isTelegramWebViewIOS;
};
