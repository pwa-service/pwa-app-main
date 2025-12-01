import type { ImageData } from "../../types/market";

import { useEffect, useRef, Fragment } from "react";

import { classNames } from "../../utils/classNames";

import { MdArrowBack, MdChevronLeft, MdChevronRight } from "react-icons/md";

interface ExpandedGalleryProps {
  images: ImageData[];
  selectedImage: string;
  onClose: () => void;
}

const ExpandedGallery = ({ images, selectedImage, onClose }: ExpandedGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollByAmount = 300;

  useEffect(() => {
    const index = images.findIndex((image) => image.src === selectedImage);

    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current;
      const slideWidth = container.offsetWidth;
      container.scrollLeft = index * slideWidth;
    }
  }, [images, selectedImage]);

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollByAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollByAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full h-screen p-5 bg-black/50 fixed top-0 left-0 z-10">
      <button onClick={onClose} className="absolute left-5 top-5 mb-5 z-20 cursor-pointer">
        <MdArrowBack size={32} className="text-white" />
      </button>

      <Fragment>
        <button
          onClick={handlePrev}
          className={classNames(
            "hidden lg:flex items-center justify-center xxl:hidden",
            "w-14 h-14 rounded-full shadow-xl bg-white sahdow-sm shadow-black/20 z-10",
            "absolute let-10 top-1/2 -translate-y-1/2",
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
            "absolute right-10 top-1/2 -translate-y-1/2",
            "text-3xl"
          )}
        >
          <MdChevronRight size={32} />
        </button>
      </Fragment>

      <div
        ref={scrollContainerRef}
        className="w-full h-full flex items-center gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-[80%] snap-center flex items-center justify-center shrink-0"
          >
            <img src={image.src} alt={image.alt} className="w-full h-full object-contain p-[5px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedGallery;
