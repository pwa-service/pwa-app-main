import { useState, useRef, useCallback, useEffect } from "react";

interface UseInstallProgressOptions {
  speed?: number;
}

export const useInstallProgress = ({ speed = 1 }: UseInstallProgressOptions = {}) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startProgress = useCallback(() => {
    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + speed;

        if (next >= 100) {
          clearInterval(intervalRef.current!);
          setProgress(100);

          return 100;
        }

        return next;
      });
    }, 100);
  }, [speed]);

  const resetProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { progress, startProgress, resetProgress };
};
