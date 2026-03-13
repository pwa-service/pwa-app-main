import { createContext, useContext } from "react";
import type { usePWAInstall } from "../hooks";

type PWAInstallContextType = ReturnType<typeof usePWAInstall>;

export const PWAInstallContext = createContext<PWAInstallContextType | undefined>(undefined);

export const usePWAInstallContext = () => {
  const context = useContext(PWAInstallContext);

  if (context === undefined) {
    throw new Error("usePWAInstallContext must be used within a PWAInstallContextProvider");
  }

  return context;
};
