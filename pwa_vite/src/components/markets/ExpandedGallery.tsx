import type { ImageData } from "../../types/market";

import { useEffect, useRef } from "react";
import { classNames } from "../../utils/classNames";

interface ExpandedGalleryProps {
  images: ImageData[];
  selectedImage: string;
  onClose: () => void;
}

const ExpandedGallery = ({ images, selectedImage, onClose }: ExpandedGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = images.findIndex((image) => image.src === selectedImage);

    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current;
      const slideWidth = container.offsetWidth;
      container.scrollLeft = index * slideWidth;
    }
  }, [images, selectedImage]);

  return (
    <div
      className={classNames(
        "w-full h-screen p-5 bg-black",
        "fixed top-0 left-0 z-10",
        "text-white"
      )}
    >
      <button onClick={onClose} className="absolute left-5 top-5 mb-5 z-20">
        Done
      </button>

      <div
        ref={scrollContainerRef}
        className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar"
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
