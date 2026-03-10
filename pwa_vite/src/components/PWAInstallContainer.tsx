import { useState, useEffect } from "react";
import { useIsWebView } from "../hooks/useIsWebView";
import { usePWAInstall } from "../hooks/usePWAInstall";

import { redirectFromWebView } from "../helpers/redirectFromWebView";
import { getQueryTail } from "../helpers/getQueryTail";

import { classNames } from "../utils/classNames";

import InstallButton from "./markets/InstallButton";

const PWAInstallContainer = () => {
  const { canInstall, promptInstall, isInstalling, isInstalled } = usePWAInstall();
  const { isWebView } = useIsWebView();
  const [appUrl, setAppUrl] = useState<string>("");

  useEffect(() => {
    const fetchUrl = async () => {
      const queryTail = await getQueryTail();
      setAppUrl(`${window.location.origin}/${queryTail}&data=from-browser`);
    };

    fetchUrl();
  }, []);

  const handleInstall = () => {
    if (isWebView) {
      redirectFromWebView();
      return;
    }

    promptInstall();
  };

  const handleOpenPWA = () => {
    if (appUrl) {
      window.open(appUrl, "_blank", "noopener");
    }
  };

  if (isInstalling) {
    return (
      <div
        className={classNames(
          "h-9 xl:h-11 sm:max-w-[160px] xl:max-w-[200px] w-full",
          "mt-6 md:mt-10"
        )}
      />
    );
  }

  if (isInstalled) {
    return <InstallButton label="Open" onClick={handleOpenPWA} />;
  }

  if (canInstall || isWebView) {
    return <InstallButton label="Install" onClick={handleInstall} />;
  }

  return (
    <div
      className={classNames(
        "h-9 xl:h-11 sm:max-w-[160px] xl:max-w-[200px] w-full",
        "mt-6 md:mt-10"
      )}
    />
  );
};

export default PWAInstallContainer;
