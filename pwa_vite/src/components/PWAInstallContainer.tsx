import { useState, useEffect } from "react";
import { useIsWebView } from "../hooks/useIsWebView";
import { usePWAInstallContext } from "../context/pwa-install/PWAInstallContext";

import { redirectFromWebView } from "../helpers/redirectFromWebView";
import { getQueryTail } from "../helpers/getQueryTail";

import InstallButton from "./markets/InstallButton";

const PWAInstallContainer = () => {
  const { promptInstall, isInstalling, isInstalled } = usePWAInstallContext();
  const { isWebView } = useIsWebView();
  const [appUrl, setAppUrl] = useState<string>("");

  useEffect(() => {
    getQueryTail().then((query) => {
      setAppUrl(`${window.location.origin}/${query}&data=from-browser`);
    });
  }, []);

  const handleInstall = () => (isWebView ? redirectFromWebView() : promptInstall());

  const handleOpenPWA = () => appUrl && window.open(appUrl, "_blank", "noopener");

  if (isInstalling) {
    return <div className="h-9 xl:h-11 sm:max-w-[160px] xl:max-w-[200px] w-full mt-6 md:mt-10" />;
  }

  if (isInstalled) {
    return <InstallButton label="Open" onClick={handleOpenPWA} />;
  }

  return <InstallButton label="Install" onClick={handleInstall} />;
};

export default PWAInstallContainer;
