export const redirectFromWebView = (): void => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIos = /iPhone|iPod|iPad/i.test(userAgent);

  const currentUrl = window.location.href;

  if (isAndroid) {
    const chromeUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
    window.location.href = chromeUrl;
  } else if (isIos) {
    alert("INSTRUCTION");
  }
};
