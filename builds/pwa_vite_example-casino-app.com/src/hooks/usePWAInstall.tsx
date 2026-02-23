import { useState, useEffect, useCallback } from "react";
import { useInstallProgress } from "./useInstallProgress";

import { PWA_INSTALLED_KEY } from "../constants/storage";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const getIsInstalled = () => {
  try {
    return JSON.parse(localStorage.getItem(PWA_INSTALLED_KEY) || "false");
  } catch {
    return false;
  }
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(getIsInstalled());

  const { isInstalling, progress, startProgress } = useInstallProgress();

  useEffect(() => {
    const onInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem(PWA_INSTALLED_KEY, "true");
    };

    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      alert("Something went wrong");
      console.warn("promptInstall called but deferredPrompt is null");
      return false;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "dismissed") {
      console.log("User dismissed installation");
      return false;
    }

    if (outcome === "accepted") {
      const isDesktop = window.matchMedia("(pointer: fine)").matches;

      if (isDesktop) {
        setDeferredPrompt(null);
        return true;
      }

      startProgress();
      setDeferredPrompt(null);
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
