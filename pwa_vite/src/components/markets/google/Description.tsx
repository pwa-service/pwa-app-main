import { type ReactNode } from "react";

import { usePWAInstall } from "../../../hooks/usePWAInstall";

import { classNames } from "../../../utils/classNames";
import { getPWAData } from "../../../helpers/getPWAData";

import { FaFileDownload } from "react-icons/fa";
import { TbRating21Plus } from "react-icons/tb";
import { MdOutlineVerifiedUser, MdStar } from "react-icons/md";

import CircularProgress from "../CircularProgress";
import PWAInstallContainer from "../../PWAInstallContainer";

interface DescriptionProps {
  imageSRC: string;
}

const Description = ({ imageSRC }: DescriptionProps) => {
  const { isInstalling, progress } = usePWAInstall();

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
                alt="product"
                width={240}
                height={240}
                loading="eager"
                fetchPriority="high"
                style={{ transform: `scale(${scale})` }}
                className={classNames(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  "rounded-2xl md:rounded-4xl shadow-2xl z-[30]",
                  "transition-transform duration-200"
                )}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-[clamp(2rem,5vw,4rem)] w-full">
              <h1 className="font-medium leading-none mr-10">{getPWAData("name")}</h1>
            </div>

            <div className="inline-flex items-center gap-1 mt-4">
              <MdOutlineVerifiedUser className="w-4 h-4 text-emerald-600" />
              <p className="text-sm md:text-base text-zinc-600">Verified by Play Protect</p>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-6 md:mt-10 overflow-x-auto">
          <StatItem
            value={getPWAData("rating")}
            label={`${getPWAData("reviewsCount")} ${getPWAData("reviewsCountLabel")}`}
            icon={<MdStar className="w-4 h-4" />}
          />

          <Divider />

          <StatItem label="Editors Choice" icon={<MdOutlineVerifiedUser className="w-5 h-5" />} />
          <Divider />

          <StatItem
            value={`${getPWAData("appSize")} ${getPWAData("appSizeLabel")}`}
            label="App size"
            icon={<FaFileDownload className="w-5 h-5" />}
          />
          <Divider />

          <StatItem label="Rated for 21+" icon={<TbRating21Plus className="w-5 h-5" />} />
        </div>
      </div>

      <PWAInstallContainer />
    </div>
  );
};

const Divider = () => <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />;

interface StatItemProps {
  value?: string;
  label: string;
  icon: ReactNode;
}

const StatItem = ({ value, label, icon }: StatItemProps) => (
  <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
    <div className="flex items-center gap-1">
      {value && <span className="font-medium">{value}</span>}

      {icon}
    </div>

    <span className="text-sm text-zinc-500 whitespace-nowrap">{label}</span>
  </div>
);

export default Description;
