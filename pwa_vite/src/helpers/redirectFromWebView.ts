export const redirectFromWebView = (): void => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  const isAndroid = /Android/i.test(navigator.userAgent);
  if (!isAndroid) return;

  setTimeout(() => {
    const currentURL = window.location.href.replace(/^https?:\/\//, "");
    const chromeIntent = `intent://${currentURL}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = chromeIntent;
  }, 100);
};
