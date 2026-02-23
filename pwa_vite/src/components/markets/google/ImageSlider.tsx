import type { ImageData } from "../../../types/market";

import { memo, useRef, Fragment, useState } from "react";
import { classNames } from "../../../utils/classNames";

import placeholder from '../../../assets/placeholder.webp'

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const SliderImage = ({ src, alt, onClick, isLast }: { 
  src: string; 
  alt: string; 
  onClick: () => void; 
  isLast: boolean 
}) => {
  const [hasError, setHasError] = useState(false);

  

  return (
    <img
      src={hasError ? placeholder : src}
      loading="lazy"
      sizes="(max-width: 768px) 141px, 254px"
      alt={alt}
      onClick={onClick}
      onError={() => setHasError(true)}  
      className={classNames(
        "w-auto h-full rounded-xl object-cover cursor-pointer bg-zinc-100",
        isLast ? "" : "mr-2"
      )}
    />
  );
};

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
          {images.map(({ src, alt }, index) => (
            <SliderImage
              key={index}
              src={src}
              alt={alt}
              onClick={() => handleSelectImage(src)}
              isLast={index === images.length - 1}
            />
          ))}
        </div>

        {variant === "google" && !showGallery && (
          <Fragment>
            <button
              aria-label="prev image"
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
              aria-label="next image"
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
