import { classNames } from "../../utils/classNames";

interface IMarketAboutSectionProps {
  texts: string[];
  tags?: string[];
  variant: "google" | "apple";
}

const MarketAboutSection = ({
  texts,
  tags,
  variant,
}: IMarketAboutSectionProps) => {
  return (
    <div className="mt-[20px]">
      <h1 className="font-semibold sm:text-[16px] text-black mb-[5px]">
        {variant === "google" ? "Sobre este juego" : "What’s New"}
      </h1>

      {texts.map((element: string, index: number) => (
        <p
          key={index}
          className={classNames(
            "sm:max-w-[270px] mds:max-w-full mb-[12px]",
            "text-[#5C5C5C] font-medium sm:text-[12px] uppercase"
          )}
        >
          {element}
        </p>
      ))}

      {variant === "google" && (
        <div className="flex gap-2.5 h-[21px]">
          {tags?.map((tag: string) => (
            <p
              key={tag}
              className={classNames(
                "flex items-center justify-between",
                "pt-[6px] pb-[6px] pr-[10px] pl-[10px]",
                "sm:text-[11px] font-medium text-[#5C5C5C]",
                "rounded-[76px] border border-[#5C5C5C]"
              )}
            >
              {tag}
            </p>
          ))}
        </div>
      )}

      {variant === "google" && (
        <div className="sm:max-w-[265px] mds:max-w-full mt-[40px]">
          <h1 className="font-semibold sm:text-[16px] text-[#000]">
            Data Security
          </h1>

          <p className="mb-[20px] mt-[10px] font-medium sm:text-[12px] text-[#5C5C5C] leading-[125%]">
            Your safety is paramount at Ultimate Casino Experience. We utilize
            top-tier encryption and security protocols to protect your data.
          </p>

          <p className="font-medium sm:text-[12px] text-[#5C5C5C] leading-[125%]">
            Transactions are secure and fast, ensuring your information remains
            private. Play with confidence in a safe, continuously updated
            environment.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketAboutSection;
