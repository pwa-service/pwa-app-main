import { classNames } from "../../../utils/classNames";

import starIcon from "../../../assets/market/google-star.svg";
import downloadsIcon from "../../../assets/market/google-downloads.svg";
import guardIcon from "../../../assets/market/google-guard.svg";

interface IGoogleMarketRattingProps {
  reviews: string;
  downloads: string;
  size: string;
  wording: string;
}

const GoogleMarketRatting = ({
  reviews,
  downloads,
  size,
  wording,
}: IGoogleMarketRattingProps) => {
  return (
    <div className="flex items-center sm:h-[29px] xl:h-[50px] justify-between">
      <div className="h-full">
        <div className="flex items-center gap-[1px] justify-center">
          <p className="font-medium text-[#0D0D0D] sm:text-[13px] xl:text-[17px] sm:mt-0 xl:mt-[3px]">
            {reviews}
          </p>

          <span>
            <img src={starIcon} alt="star" />
          </span>
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">
          Resenas
        </p>
      </div>

      <div className="w-[1px] h-[20px] bg-black ml-[13px] mr-[13px] xl:text-[17px]" />

      <div className="h-full">
        <div className="flex items-center justify-center">
          <p className="font-medium text-[#0D0D0D] sm:text-[13px] xl:text-[16px] uppercase sm:mt-0 xl:mt-[3px]">
            {downloads}
          </p>
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">
          Descargas
        </p>
      </div>

      <div className="w-[1px] h-[20px] ml-[13px] mr-[13px] bg-black" />

      <div className="h-full">
        <div className="flex items-center justify-center sm:mb-[2px] xl:mb-[6px] mt-[3px] xl:mt-[5px]">
          <img
            src={downloadsIcon}
            alt="downloads"
            className="sm:w-[12px] sm:h-[14px]
            xl:w-[15px] xl:h-[17px]"
          />
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">
          {size}
        </p>
      </div>

      <div
        className={classNames(
          "w-[1px] h-[20px]",
          "ml-[13px] sm:mr-[13px] xl:mr-0",
          "bg-black"
        )}
      />

      <div className="h-full">
        <div className="flex items-center justify-center sm:mb-[2px] xl:mb-[6px] mt-[3px] xl:mt-[5px]">
          <img
            src={guardIcon}
            alt="guard"
            className="sm:w-[12px] sm:h-[14px] xl:w-[17px] xl:h-[17px]"
          />
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">
          {wording}
        </p>
      </div>
    </div>
  );
};

export default GoogleMarketRatting;
