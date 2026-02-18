export const useIsFacebookWebView = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isFacebookWebView: false,
    };
  }

  const userAgent = navigator.userAgent || "";

  const isFacebookWebView =
    userAgent.includes("FBAN") || userAgent.includes("FBAV") || userAgent.includes("Instagram");

  return {
    isFacebookWebView,
  };
};
