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

  const [isPrompting, setIsPrompting] = useState<boolean>(false);
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

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem(PWA_INSTALLED_KEY, "true");
    };

    const checkInstallation = async () => {
      if ("getInstalledRelatedApps" in navigator) {
        try {
          // @ts-expect-error - Standard PWA API not yet in TS types
          const relatedApps = await navigator.getInstalledRelatedApps();

          if (relatedApps.length > 0) {
            handleAppInstalled();
          }
        } catch (error) {
          console.error("Error checking installed apps:", error);
        }
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("pwa-prompt-ready", handleCustomReady);

    checkInstallation();

    if (window.matchMedia("(display-mode: standalone)").matches) {
      handleAppInstalled();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
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
      setIsPrompting(true);
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
    } finally {
      setIsPrompting(false);
    }

    return false;
  }, [deferredPrompt, startProgress]);

  return {
    canInstall: !!deferredPrompt,
    promptInstall,
    isInstalling,
    isPrompting,
    progress,
    isInstalled,
  };
};
