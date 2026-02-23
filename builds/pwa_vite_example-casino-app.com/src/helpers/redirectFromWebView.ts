export const redirectFromWebView = (): void => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);

  if (!isAndroid) return;

  setTimeout(() => {
    const currentURL = window.location.href;
    const chromeURL = `intent://${currentURL.replace(
      /^https?:\/\//,
      ""
    )}#Intent;scheme=https;package=com.android.chrome;end`;

    window.location.href = chromeURL;
  }, 1000);
};
