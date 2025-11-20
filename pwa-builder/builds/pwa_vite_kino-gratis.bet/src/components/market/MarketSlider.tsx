import { useRef } from "react";
import { classNames } from "../../utils/classNames";
import type { Dispatch, SetStateAction } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface IPictureData {
  src: string;
  alt?: string;
}

interface IMarketSliderProps {
  pictures: IPictureData[];
  variant: "apple" | "google";
  setIsFullSlider: Dispatch<SetStateAction<boolean>>;
  setSelectedPicture: Dispatch<SetStateAction<string>>;
}

const MarketSlider = ({
  pictures,
  variant,
  setIsFullSlider,
  setSelectedPicture,
}: IMarketSliderProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = 300;

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={classNames(
          "whitespace-nowrap no-scrollbar",
          "overflow-x-auto xl:overflow-x-hidden",
          "xl:cursor-default"
        )}
      >
        {pictures.map((pic, index) => (
          <img
            key={index}
            src={pic.src}
            alt={pic.alt || `slide-${index}`}
            onClick={() => {
              setIsFullSlider(true);
              setSelectedPicture(pic.src);
            }}
            className={classNames(
              "inline-block object-cover rounded-xl mr-2",
              variant === "google"
                ? [
                    "sm:w-[126px] md:w-[126px]  lg:w-[200px] xl:w-[290px]",
                    "sm:h-[209px] md:h-[209px] lg:h-[330px] xl:h-[490px]",
                  ]
                : "sm:w-[181px] sm:h-[300px]"
            )}
          />
        ))}
      </div>

      {variant === "google" && (
        <>
          <button
            onClick={handlePrev}
            className={classNames(
              "hidden xl:flex items-center justify-center xxl:hidden",
              "w-[70px] h-[70px] rounded-full bg-white z-10",
              "absolute left-2 top-1/2 -translate-y-1/2",
              "text-3xl"
            )}
            style={{
              boxShadow:
                "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
            }}
          >
            <ChevronLeft />
          </button>

          <button
            onClick={handleNext}
            className={classNames(
              "hidden xl:flex items-center justify-center xxl:hidden",
              "w-[70px] h-[70px] rounded-full bg-white z-10",
              "absolute right-2 top-1/2 -translate-y-1/2",
              "text-3xl"
            )}
            style={{
              boxShadow:
                "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
            }}
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default MarketSlider;
