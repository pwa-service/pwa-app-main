import { useContext } from "react";
import { PWAInstallContext } from "./PWAInstallContext";

export const usePWAInstallContext = () => {
  const context = useContext(PWAInstallContext);

  if (!context) throw new Error("useInstall must be used within <InstallProvider>");

  return context;
};
