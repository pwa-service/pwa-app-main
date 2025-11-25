import { useState, useEffect } from "react";

export const useIsPWA = () => {
  const isInitialPWA =
    (typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true)) ||
    false;

  const [isPWA, setIsPWA] = useState<boolean>(isInitialPWA);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(display-mode: standalone)");
    const handler = (event: MediaQueryListEvent) => setIsPWA(event.matches);

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return {
    isPWA,
  };
};
