import { useState, useEffect, useCallback } from "react";

import { useUserAgent } from "../hooks/useUserAgent";
import { useInstallProgress } from "../hooks/useInstallProgress";

import type { BeforeInstallPromptEvent } from "../types/install";

const PWA_ISTALLED_KEY = "pwa_installed";

const getIsInstalled = (): boolean => {
  try {
    return JSON.parse(localStorage.getItem(PWA_ISTALLED_KEY) || "false");
  } catch {
    return false;
  }
};

export const usePWAInstall = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(getIsInstalled());

  const { isPWA, isIOS } = useUserAgent();
  const { progress, startProgress, resetProgress } = useInstallProgress({ speed: 5 });

  useEffect(() => {
    if (isPWA) {
      setIsInstalled(true);
      localStorage.setItem("pwa_installed", "true");
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstalling(false);
      localStorage.setItem("pwa_installed", "true");
      setPrompt(null);
      resetProgress();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isPWA, resetProgress]);

  const handleInstallStart = useCallback(() => {
    if (isIOS && !isPWA) {
      setShowIOSInstructions(true);
      return;
    }

    if (!prompt) return;

    setIsInstalling(true);
    startProgress();
  }, [prompt, isIOS, isPWA, startProgress]);

  useEffect(() => {
    if (!prompt || progress < 100) return;

    const install = async () => {
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;

        if (outcome === "accepted") {
          setIsInstalled(true);
          localStorage.setItem("pwa_installed", "true");
        } else {
          setIsInstalled(false);
        }
      } finally {
        setIsInstalling(false);
        resetProgress();
        setPrompt(null);
      }
    };

    install();
  }, [progress, prompt, resetProgress]);

  return {
    isInstalling,
    isInstalled,
    progress,
    handleInstallStart,
    showIOSInstructions,
    setShowIOSInstructions,
  };
};
