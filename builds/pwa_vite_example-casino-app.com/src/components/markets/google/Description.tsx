import { usePWAInstall } from "../../../hooks/usePWAInstall";
import { useIsWebView } from "../../../hooks/useIsWebView";

import { classNames } from "../../../utils/classNames";
import { getQueryTail } from "../../../helpers/getQueryTail";
import { redirectFromWebView } from "../../../helpers/redirectFromWebView";

import { MdOutlineVerifiedUser, MdStar } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { TbRating21Plus } from "react-icons/tb";
import CircularProgress from "../CircularProgress";
import InstallButton from "../InstallButton";

interface DescriptionProps {
  imageSRC: string;
  productName: string;
}

const Description = ({ imageSRC, productName }: DescriptionProps) => {
  const { promptInstall, isInstalling, progress, isInstalled } = usePWAInstall();
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

  const scale = isInstalling ? 0.5 : 1;

  return (
    <div className="relative flex-row md:flex-col gap-6 w-full mt-6 md:mt-12">
      <div className="w-full">
        <div className="flex items-start gap-6">
          <div
            className={classNames(
              "md:absolute top-0 right-0",
              "w-20 md:w-[180px] xl:w-[240px]",
              "shrink-0 aspect-square overflow-hidden",
              "rounded-2xl md:rounded-4xl"
            )}
          >
            <div className="relative w-full h-full">
              {isInstalling && <CircularProgress progress={progress} />}

              <img
                src={imageSRC}
                alt="product image"
                width={240}
                height={240}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 768px) 141px, (max-width: 1280px) 180px, 240px"
                style={{ transform: `scale(${scale})` }}
                className={classNames(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  "rounded-2xl md:rounded-4xl shadow-2xl z-[30]",
                  "transition-transform duration-200 "
                )}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-[clamp(2rem,5vw,4rem)] w-full">
              <h1 className="font-medium leading-none mr-10">{productName}</h1>
            </div>

            <div className="inline-flex items-center gap-1 mt-4">
              <MdOutlineVerifiedUser className="w-4 h-4 text-emerald-600" />
              <p className="text-sm md:text-base text-zinc-600">Verified by Play Protect</p>
            </div>
          </div>
        </div>

        <div className={classNames("flex items-center mt-6 md:mt-10 overflow-x-auto")}>
          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <div className="flex items-center gap-1">
              <span className="font-medium">4.8</span>
              <MdStar className="w-4 h-4" />
            </div>

            <span className="text-sm text-zinc-500">499 reviews</span>
          </div>

          <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />

          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <MdOutlineVerifiedUser className="w-5 h-5" />
            <span className="text-sm text-zinc-600">Editors Choise</span>
          </div>

          <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />

          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <FiDownload className="w-5 h-5" />
            <span className="text-sm text-zinc-600">6.9 MB</span>
          </div>

          <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />

          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <TbRating21Plus className="w-5 h-5" />
            <span className="text-sm text-zinc-600">Rated for 21+</span>
          </div>
        </div>
      </div>

      {isInstalled && !isInstalling && <InstallButton label="Open" onClick={handleOpenPWA} />}
      {!isInstalling && !isInstalled && <InstallButton label="Install" onClick={handleInstall} />}
    </div>
  );
};

export default Description;
