export const redirectFromWebView = (): void => {
  if (typeof navigator === "undefined" || typeof window === "undefined") return;

  const userAgent = navigator.userAgent;
  const currentUrl = window.location.href;

  const isAndroid = /Android/i.test(userAgent);
  const isIos = /iPhone|iPod|iPad/i.test(userAgent);

  if (isAndroid) {
    window.location.href = `intent://${currentUrl.replace(
      /^https?:\/\//,
      ""
    )}#Intent;scheme=https;package=com.android.chrome;end`;
  } else if (isIos) {
    alert("Откройте страницу в Safari для лучшей работы.");
  }
};
