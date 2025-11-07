import { type ReactNode } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { PWAInstallContext } from "./PWAInstallContext";

interface PWAInstallProviderProps {
  children: ReactNode;
}

const PWAInstallProvider = ({ children }: PWAInstallProviderProps) => {
  const installPrompt = usePWAInstall();

  return <PWAInstallContext.Provider value={installPrompt}>{children}</PWAInstallContext.Provider>;
};

export default PWAInstallProvider;
