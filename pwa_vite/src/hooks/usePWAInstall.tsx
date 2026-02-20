import type { BeforeInstallPromptEvent } from "../types/global";

import { useState, useEffect, useCallback } from "react";
import { useInstallProgress } from "./useInstallProgress";
import { PWA_INSTALLED_KEY } from "../constants/storage";

const getIsInstalled = () => {
  try {
    return JSON.parse(localStorage.getItem(PWA_INSTALLED_KEY) || "false");
  } catch {
    return false;
  }
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    window.deferredPrompt || null
  );

  const [isInstalled, setIsInstalled] = useState<boolean>(getIsInstalled());

  const { isInstalling, progress, startProgress } = useInstallProgress();

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleCustomReady = () => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("pwa-prompt-ready", handleCustomReady);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("pwa-prompt-ready", handleCustomReady);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;

    if (!promptEvent) {
      console.warn("Attempt to call the installation without an event");
      return false;
    }

    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;

      if (outcome === "accepted") {
        startProgress();
        setDeferredPrompt(null);
        window.deferredPrompt = null;

        return true;
      }
    } catch (error) {
      console.error("Error when calling the setup window:", error);
    }

    return false;
  }, [deferredPrompt, startProgress]);

  return {
    canInstall: !!deferredPrompt,
    promptInstall,
    isInstalling,
    progress,
    isInstalled,
  };
};
