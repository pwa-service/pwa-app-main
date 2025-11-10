import { Fragment, useRef } from "react";
import { classNames } from "../../utils/classNames";
import type { IImageData } from "../../types/market";
import type { Dispatch, SetStateAction } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSliderProps {
  pictures: IImageData[];
  variant: "apple" | "google";
  setIsFullSlider: Dispatch<SetStateAction<boolean>>;
  setSelectedPicture: Dispatch<SetStateAction<string>>;
}

const ProductSlider = ({
  pictures,
  variant,
  setIsFullSlider,
  setSelectedPicture,
}: ProductSliderProps) => {
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

  const handleSelect = (src: string) => {
    setIsFullSlider(true);
    setSelectedPicture(src);
  };

  return (
    <div className="relative w-full mb-6 md:mb-10">
      <div
        ref={scrollRef}
        className="flex aspect-video overflow-x-auto no-scrollbar"
      >
        {pictures.map(({ src, alt }, index) => {
          const isLast = index === pictures.length - 1;

          return (
            <img
              key={index}
              src={src}
              alt={alt || `slide-${index}`}
              onClick={() => handleSelect(src)}
              className={classNames(
                "w-full h-full rounded-xl object-cover",
                isLast ? "" : "mr-2"
              )}
            />
          );
        })}
      </div>

      {variant === "google" && (
        <Fragment>
          <button
            onClick={handlePrev}
            className={classNames(
              "hidden xl:flex items-center justify-center xxl:hidden",
              "w-16 h-16 rounded-full shadow-xl bg-white z-10",
              "absolute left-2 top-1/2 -translate-y-1/2",
              "text-3xl"
            )}
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={handleNext}
            className={classNames(
              "hidden xl:flex items-center justify-center xxl:hidden",
              "w-16 h-16 rounded-full shadow-xl bg-white z-10",
              "absolute right-2 top-1/2 -translate-y-1/2",
              "text-3xl"
            )}
          >
            <ChevronRight size={32} />
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default ProductSlider;
