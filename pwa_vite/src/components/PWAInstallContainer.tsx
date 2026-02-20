import { useIsWebView } from "../hooks/useIsWebView";
import { usePWAInstall } from "../hooks/usePWAInstall";

import { redirectFromWebView } from "../helpers/redirectFromWebView";
import { getQueryTail } from "../helpers/getQueryTail";

import { classNames } from "../utils/classNames";

import InstallButton from "./markets/InstallButton";

const PWAInstallContainer = () => {
  const { canInstall, promptInstall, isInstalling, isInstalled } = usePWAInstall();
  const { isWebView } = useIsWebView();

  const handleInstall = () => {
    if (isWebView) {
      redirectFromWebView();
      return;
    }

    promptInstall();
  };

  const handleOpenPWA = async () => {
    const queryTail = await getQueryTail();
    const url = `${window.location.origin}/${queryTail}&data=from-browser`;
    window.open(url, "_blank", "noopener");
  };

  if (isInstalling) return null;

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
