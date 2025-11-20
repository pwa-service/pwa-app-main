import { useEffect, useState } from "react";
import { useUserAgent } from "../hooks/useUserAgent";
import { REDIRECT_URL_KEY, HAS_VISITED_PWA_KEY } from "../constants/storage";
import { getPWAData } from "../helpers/getPWAData";

const GlobalRedirect = () => {
  const { isPWA } = useUserAgent();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.serviceWorker) return;

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "SET_REDIRECT_URL" && typeof event.data.url === "string") {
        setRedirectUrl(event.data.url);
      }
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!isPWA) return;

    const hasVisited = localStorage.getItem(HAS_VISITED_PWA_KEY);
    const savedRedirectUrl = localStorage.getItem(REDIRECT_URL_KEY);

    if (!savedRedirectUrl) return;

    if (!hasVisited) {
      localStorage.setItem(HAS_VISITED_PWA_KEY, "true");
      setRedirectUrl(savedRedirectUrl);
      return;
    }

    const nextUrl = getPWAData().product_url;
    const currentPath = window.location.pathname;

    if (currentPath !== nextUrl) setRedirectUrl(nextUrl);
  }, [isPWA]);

  useEffect(() => {
    if (!redirectUrl) return;
    if (window.location.href === redirectUrl || window.location.pathname === redirectUrl) return;

    const timeout = setTimeout(() => {
      window.location.href = redirectUrl!;
    }, 0);

    return () => clearTimeout(timeout);
  }, [redirectUrl]);

  return null;
};

export default GlobalRedirect;
