export const redirectFromWebView = (): void => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  const userAgent = navigator.userAgent || "";
  const currentUrl = window.location.href;

  const isAndroid = /Android/i.test(userAgent);
  const isIos = /iPhone|iPod|iPad/i.test(userAgent);

  if (isAndroid) {
    alert("ALERT");

    const url = new URL(currentUrl);
    const cleanUrl = url.host + url.pathname;

    window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
  } else if (isIos) {
    alert("INSTRUCTION");
  }
};
