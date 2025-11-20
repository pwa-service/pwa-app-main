import { useState, useEffect } from "react";

export const useInstallProgress = (duration: number = 5000) => {
  const [progress, setProgress] = useState<number>(0);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  const startProgress = () => {
    if (isInstalling) return;

    setIsInstalling(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!isInstalling) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setIsInstalling(false);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isInstalling, duration]);

  return {
    progress,
    isInstalling,
    startProgress,
  };
};
