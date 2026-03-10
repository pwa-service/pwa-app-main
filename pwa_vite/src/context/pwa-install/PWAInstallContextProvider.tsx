import { type ReactNode } from "react";
import { PWAInstallContext } from "./PWAInstallContext";
import { usePWAInstall } from "../../hooks/usePWAInstall";

interface PWAInstallContextProviderProps {
  children: ReactNode;
}

const PWAInstallContextProvider = ({ children }: PWAInstallContextProviderProps) => {
  const pwaInstallData = usePWAInstall();

  return <PWAInstallContext.Provider value={pwaInstallData}>{children}</PWAInstallContext.Provider>;
};

export default PWAInstallContextProvider;
