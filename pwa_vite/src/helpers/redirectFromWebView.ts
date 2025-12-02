export const redirectFromWebView = (isWebView: boolean): boolean => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);

  if (!isWebView || !isAndroid) return false;

  const currentUrl = window.location.href;
  const chromeUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
  window.location.href = chromeUrl;

  return true;
};
