import { useEffect, useState } from "react";
import { useUserAgent } from "../hooks/useUserAgent";
import { REDIRECT_URL_KEY } from "../constants/storage";

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
    const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);

    if (isPWA && redirectUrl) {
      setRedirectUrl(redirectUrl);
    }
  }, [isPWA]);

  useEffect(() => {
    if (!redirectUrl) return;

    if (window.location.href === redirectUrl) return;

    const timeout = setTimeout(() => {
      window.location.href = redirectUrl!;
    }, 500);

    return () => clearTimeout(timeout);
  }, [redirectUrl]);

  return null;
};

export default GlobalRedirect;
