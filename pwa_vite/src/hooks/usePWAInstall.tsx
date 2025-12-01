import { useState, useEffect, useCallback } from "react";
import { useInstallProgress } from "./useInstallProgress";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const PWA_ISTALLED_KEY = "pwa_installed";

const getIsInstalled = (): boolean => {
  try {
    return JSON.parse(localStorage.getItem(PWA_ISTALLED_KEY) || "false");
  } catch {
    return false;
  }
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(getIsInstalled());

  const { isInstalling, progress, startProgress } = useInstallProgress();

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const onInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem(PWA_ISTALLED_KEY, JSON.stringify(true));
    };

    if (progress >= 100 && !isInstalled) onInstalled();
  }, [progress, isInstalled]);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (outcome === "accepted") {
      const isDesktop = window.matchMedia("(pointer: fine)").matches;

      if (isDesktop) {
        setIsInstalled(true);
        localStorage.setItem(PWA_ISTALLED_KEY, JSON.stringify(true));
        return true;
      }

      startProgress();
      return true;
    }
  }, [deferredPrompt, startProgress]);

  return {
    deferredPrompt,
    promptInstall,
    isInstalling,
    progress,
    isInstalled,
  };
};
