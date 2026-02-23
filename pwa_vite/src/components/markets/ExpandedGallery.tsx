import type { ImageData } from "../../types/market";

import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";

import placeholder from "../../assets/placeholder.webp";
import { MdArrowBack, MdChevronLeft, MdChevronRight } from "react-icons/md";

interface ExpandedGalleryProps {
  images: ImageData[];
  selectedImage: string;
  onClose: () => void;
}

const ExpandedGalleryImageItem = ({ src, alt }: { src: string; alt: string }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="w-full h-full flex items-center justify-center shrink-0 snap-center p-4">
      <img
        loading="lazy"
        src={hasError ? placeholder : src}
        alt={alt}
        onError={() => setHasError(true)}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  );
};

const ExpandedGallery = ({ images, selectedImage, onClose }: ExpandedGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const index = images.findIndex((image) => image.src === selectedImage);

    if (scrollContainerRef.current && index !== -1) {
      const slideWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollLeft = index * slideWidth;
    }
  }, [images, selectedImage]);

  const handleScroll = (direction: "next" | "prev") => {
    if (scrollContainerRef.current) {
      const { offsetWidth } = scrollContainerRef.current;
      const scrollAmount = direction === "next" ? offsetWidth : -offsetWidth;

      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75">
      <button
        aria-label="close gallery"
        onClick={onClose}
        className="absolute top-6 left-6 z-[10000] p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
      >
        <MdArrowBack size={32} />
      </button>

      <div className="absolute inset-x-4 top-1/2 flex justify-between -translate-y-1/2 pointer-events-none">
        <button
          aria-label="previous image"
          onClick={() => handleScroll("prev")}
          className="pointer-events-auto p-3 cursor-pointer bg-white hover:bg-gray-100 rounded-full shadow-xl transition-all"
        >
          <MdChevronLeft size={32} />
        </button>

        <button
          aria-label="next image"
          onClick={() => handleScroll("next")}
          className="pointer-events-auto p-3 cursor-pointer bg-white hover:bg-gray-100 rounded-full shadow-xl transition-all"
        >
          <MdChevronRight size={32} />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex w-full h-[85vh] items-center overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {images.map((image, index) => (
          <ExpandedGalleryImageItem key={index} src={image.src} alt={image.alt} />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ExpandedGallery;
