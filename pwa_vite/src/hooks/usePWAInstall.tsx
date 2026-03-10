import type { BeforeInstallPromptEvent } from "../types/global";
import { useState, useEffect, useCallback } from "react";
import { useInstallProgress } from "./useInstallProgress";
import { PWA_INSTALLED_KEY } from "../constants/storage";

const getIsInstalled = () => {
  try {
    return localStorage.getItem(PWA_INSTALLED_KEY) === "true";
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

  const handleAppInstalled = useCallback(() => {
    setIsInstalled(true);
    localStorage.setItem(PWA_INSTALLED_KEY, "true");
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleCustomReady = () => setDeferredPrompt(window.deferredPrompt || null);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("pwa-prompt-ready", handleCustomReady);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      handleAppInstalled();
    }

    if ("getInstalledRelatedApps" in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps.length > 0) handleAppInstalled();
        });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("pwa-prompt-ready", handleCustomReady);
    };
  }, [handleAppInstalled]);

  useEffect(() => {
    if (!isInstalling && progress >= 100) {
      handleAppInstalled();
    }
  }, [isInstalling, progress, handleAppInstalled]);

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) return false;

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
      console.error("PWA Install Error:", error);
    }
    return false;
  }, [deferredPrompt, startProgress]);

  return {
    promptInstall,
    isInstalling,
    progress,
    isInstalled,
  };
};
