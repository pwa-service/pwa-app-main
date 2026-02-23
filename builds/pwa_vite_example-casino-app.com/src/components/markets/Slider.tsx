import type { ImageData } from "../../types/market";

import { memo, useRef, Fragment } from "react";
import { classNames } from "../../utils/classNames";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface SliderProps {
  variant: "apple" | "google";
  images: ImageData[];
  handleSelectImage: (image: string) => void;
}

const Slider = memo(({ variant, images, handleSelectImage }: SliderProps) => {
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
    <div className="relative w-full mb-6 md:mb-10">
      <div ref={scrollRef} className="flex aspect-video overflow-x-auto no-scrollbar">
        {images.map(({ src, alt }, index) => {
          const isLast = index === images.length - 1;

          return (
            <img
              key={index}
              src={src}
              alt={alt || `slide-${index}`}
              onClick={() => handleSelectImage(src)}
              className={classNames("w-full h-full rounded-xl object-cover", isLast ? "" : "mr-2")}
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
            <MdChevronLeft size={32} />
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
            <MdChevronRight size={32} />
          </button>
        </Fragment>
      )}
    </div>
  );
});

export default Slider;
