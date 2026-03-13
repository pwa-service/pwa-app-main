import { type ReactNode } from "react";
import { usePWAInstall } from "../hooks";
import { PWAInstallContext } from "./PWAInstallContext";

interface PWAInstallContextProviderProps {
  children: ReactNode;
}

const PWAInstallContextProvider = ({ children }: PWAInstallContextProviderProps) => {
  const pwaInstallData = usePWAInstall();

  return <PWAInstallContext.Provider value={pwaInstallData}>{children}</PWAInstallContext.Provider>;
};

export default PWAInstallContextProvider;
