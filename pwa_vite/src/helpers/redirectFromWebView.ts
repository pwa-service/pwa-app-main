export const redirectFromWebView = (): void => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  const currentUrl = window.location.href;
  const chromeUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
  window.location.href = chromeUrl;
};
