import { useState, useEffect } from "react";
import { detectWebView } from "../helpers/detectWebView";

export const useIsWebView = () => {
  const [isWebView, setIsWebView] = useState<boolean>(false);

  const update = () => setIsWebView(detectWebView());

  useEffect(() => {
    update();

    window.addEventListener("pageshow", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.removeEventListener("pageshow", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return {
    isWebView,
  };
};
