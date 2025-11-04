import { useState, useEffect } from "react";

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export const useUserAgent = () => {
  const [isPWA, setIsPWA] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const checkPWA = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ) {
        setIsPWA(true);
      }
    };

    checkPWA();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkPWA);

    return () => mediaQuery.removeEventListener("change", checkPWA);
  }, []);

  return {
    isPWA,
    isIOS,
  };
};
