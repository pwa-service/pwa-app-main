// export const redirectFromWebView = (): void => {
//   if (typeof window === "undefined" || typeof navigator === "undefined") return;

//   const currentUrl = window.location.href;
//   const chromeUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
//   window.location.href = chromeUrl;
// };

export const redirectFromWebView = (isWebView: boolean): boolean => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);

  if (!isWebView || !isAndroid) return false;

  const currentUrl = window.location.href;
  const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = intentUrl;
  document.body.appendChild(iframe);

  setTimeout(() => {
    window.location.href = currentUrl;
  }, 1500);

  return true;
};
