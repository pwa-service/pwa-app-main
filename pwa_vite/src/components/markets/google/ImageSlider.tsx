import type { ImageData } from "../../../types/market";

import { memo, useRef, Fragment } from "react";
import { classNames } from "../../../utils/classNames";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface ImageSliderProps {
  variant?: "google" | "apple";
  images: ImageData[];
  handleSelectImage: (image: string) => void;
  showGallery: boolean;
}

const ImageSlider = memo(
  ({ variant = "google", images, handleSelectImage, showGallery }: ImageSliderProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const scrollByAmount = 300;

    const handleNext = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: scrollByAmount,
          behavior: "smooth",
        });
      }
    };

    const handlePrev = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: -scrollByAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="relative w-full h-[250px] md:h-[450px] mt-6">
        <div ref={scrollRef} className="flex h-full overflow-x-auto no-scrollbar">
          {images.map(({ src, alt }, index) => {
            const isLast = index === images.length - 1;

            return (
              <img
                key={index}
                src={src}
                srcSet={`${src}?w=300 300w, ${src}?w=600 600w, ${src}?w=1200 1200w`}
                sizes="(max-width: 768px) 141px, 254px"
                alt={alt || `slide-${index}`}
                loading={index === 0 ? "eager" : "lazy"}
                onClick={() => handleSelectImage(src)}
                className={classNames(
                  "w-full h-full rounded-xl object-cover",
                  isLast ? "" : "mr-2"
                )}
              />
            );
          })}
        </div>

        {variant === "google" && !showGallery && (
          <Fragment>
            <button
              onClick={handlePrev}
              className={classNames(
                "hidden lg:flex items-center justify-center xxl:hidden",
                "w-14 h-14 rounded-full shadow-xl bg-white sahdow-sm shadow-black/20 z-10",
                "absolute -left-7 top-1/2 -translate-y-1/2",
                "text-3xl"
              )}
            >
              <MdChevronLeft size={32} />
            </button>

            <button
              onClick={handleNext}
              className={classNames(
                "hidden lg:flex items-center justify-center xxl:hidden",
                "w-14 h-14 rounded-full shadow-xl bg-white sahdow-sm shadow-black/20 z-10",
                "absolute -right-7 top-1/2 -translate-y-1/2",
                "text-3xl"
              )}
            >
              <MdChevronRight size={32} />
            </button>
          </Fragment>
        )}
      </div>
    );
  }
);

export default ImageSlider;
