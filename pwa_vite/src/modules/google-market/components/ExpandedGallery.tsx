import ReactDOM from "react-dom";
import { useRef, useEffect, useCallback } from "react";
import { classNames } from "../../../utils/classNames";

import { MdArrowBack, MdChevronLeft, MdChevronRight } from "react-icons/md";
import SmartImage from "./SmartImage";

interface ExpandedGalleryProps {
  images: string[];
  selectedImage: string;
  onClose: () => void;
}

const ExpandedGallery = ({ images, selectedImage, onClose }: ExpandedGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = images.indexOf(selectedImage);

    if (containerRef.current && index !== -1) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({ left: index * width });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow || "unset";
    };
  }, []);

  const handleNext = useCallback(() => {
    containerRef.current?.scrollBy({ left: containerRef.current.offsetWidth, behavior: "smooth" });
  }, []);

  const handlePrev = useCallback(() => {
    containerRef.current?.scrollBy({ left: -containerRef.current.offsetWidth, behavior: "smooth" });
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-md">
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 p-3 cursor-pointer text-white bg-white/10 rounded-full"
      >
        <MdArrowBack size={32} />
      </button>

      {/* MAIN CONTENT */}
      <div
        ref={containerRef}
        className="flex w-full h-full items-center overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 flex items-center justify-center snap-center p-4"
          >
            <SmartImage src={image} className="max-w-full max-h-full object-contain shadow-2xl" />
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      {images.length > 1 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            className={classNames(
              "pointer-events-auto cursor-pointer bg-white/10  text-white",
              "p-3 rounded-full backdrop-blur-md shadow-lg",
              "hover:text-black hover:bg-white",
              "transition-all"
            )}
          >
            <MdChevronLeft size={36} />
          </button>

          <button
            onClick={handleNext}
            className={classNames(
              "pointer-events-auto cursor-pointer bg-white/10  text-white",
              "p-3 rounded-full backdrop-blur-md shadow-lg",
              "hover:text-black hover:bg-white",
              "transition-all"
            )}
          >
            <MdChevronRight size={36} />
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default ExpandedGallery;
