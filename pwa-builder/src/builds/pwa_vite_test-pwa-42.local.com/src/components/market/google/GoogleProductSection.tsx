import { classNames } from "../../../utils/classNames";

import checkIcon from "../../../assets/market/check.svg";

interface IGoogleProductSectionProps {
  image: string;
  name: string;
  creator: string;
  subtitle: string;
}

const GoogleProductSection = ({
  image,
  name,
  creator,
  subtitle,
}: IGoogleProductSectionProps) => {
  return (
    <div className="flex mb-[20px]">
      <div
        className="sm:w-[80px] sm:h-[80px] xl:w-[120px] xl:h-[120px]"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="ml-[12px]">
        <h2
          className={classNames(
            "mb-[5px]",
            "flex items-center gap-[4px]",
            "font-medium sm:text-[16px] xl:text-[20px]"
          )}
        >
          {name}

          <img src={checkIcon} alt="check" className="w-[14px] h-[14px]" />
        </h2>

        <h3
          className={classNames(
            "mb-[2px]",
            "text-[#00A173] uppercase",
            "font-medium sm:text-[11px]  xl:text-[13px]"
          )}
        >
          {creator}
        </h3>

        <p className="font-normal text-[#5C5C5C] sm:text-[9px] xl:text-[11px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default GoogleProductSection;
