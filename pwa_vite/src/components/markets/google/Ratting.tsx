import { classNames } from "../../../utils/classNames";

import starIcon from "../../../assets/markets/google/google_star.svg";
import downloadsIcon from "../../../assets/markets/google/google_downloads.svg";
import guardIcon from "../../../assets/markets/google/google_guard.svg";

interface RattingProps {
  reviews: string;
  downloads: string;
  size: string;
  wording: string;
}

const Ratting = ({ reviews, downloads, size, wording }: RattingProps) => {
  return (
    <div className="flex items-center sm:h-[29px] xl:h-[50px] justify-between">
      <div className="h-full">
        <div className="flex items-center gap-px justify-center">
          <p className="font-medium text-[#0D0D0D] sm:text-[13px] xl:text-[17px] sm:mt-0 xl:mt-[3px]">
            {reviews}
          </p>

          <span>
            <img src={starIcon} alt="star" />
          </span>
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">Resenas</p>
      </div>

      <div className="w-px h-5 bg-black ml-[13px] mr-[13px] xl:text-[17px]" />

      <div className="h-full">
        <div className="flex items-center justify-center">
          <p className="font-medium text-[#0D0D0D] sm:text-[13px] xl:text-[16px] uppercase sm:mt-0 xl:mt-[3px]">
            {downloads}
          </p>
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">Descargas</p>
      </div>

      <div className="w-px h-5 ml-[13px] mr-[13px] bg-black" />

      <div className="h-full">
        <div className="flex items-center justify-center sm:mb-0.5 xl:mb-1.5 mt-[3px] xl:mt-[5px]">
          <img
            src={downloadsIcon}
            alt="downloads"
            className="sm:w-3 sm:h-3.5
            xl:w-[15px] xl:h-[17px]"
          />
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">{size}</p>
      </div>

      <div className={classNames("w-px h-5", "ml-[13px] sm:mr-[13px] xl:mr-0", "bg-black")} />

      <div className="h-full">
        <div className="flex items-center justify-center sm:mb-0.5 xl:mb-1.5 mt-[3px] xl:mt-[5px]">
          <img src={guardIcon} alt="guard" className="sm:w-3 sm:h-3.5 xl:w-[17px] xl:h-[17px]" />
        </div>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[12px]">{wording}</p>
      </div>
    </div>
  );
};

export default Ratting;
