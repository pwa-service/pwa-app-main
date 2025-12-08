export const redirectFromWebView = (): void => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);

  if (isAndroid) {
    const currentUrl = window.location.href;
    const isChrome = !/Chrome/i.test(navigator.userAgent);

    if (isChrome) {
      const chromeUrl = `intent://${currentUrl.replace(
        /^https?:\/\//,
        ""
      )}#Intent;scheme=https;end`;

      window.location.replace(chromeUrl);
    }
  }
};
