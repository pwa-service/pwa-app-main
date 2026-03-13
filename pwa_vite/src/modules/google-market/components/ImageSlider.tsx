import { memo, useRef, Fragment } from "react";

import SmartImage from "./SmartImage";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface ImageSliderProps {
  variant?: "google" | "apple";
  images: string[];
  onSelectImage: (image: string) => void;
}

const ImageSlider = memo(({ variant = "google", images, onSelectImage }: ImageSliderProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group w-full h-[250px] md:h-[450px] mt-6">
      <div ref={scrollRef} className="flex h-full overflow-x-auto no-scrollbar gap-2">
        {images.map((image, index) => (
          <SmartImage
            key={index}
            src={image}
            alt={`Screenshot ${index}`}
            loading="lazy"
            onClick={() => onSelectImage(image)}
            className="w-auto h-full rounded-xl object-cover cursor-pointer bg-zinc-100 flex-shrink-0"
          />
        ))}
      </div>

      {variant === "google" && (
        <Fragment>
          <button
            onClick={() => handleScroll("left")}
            className="hidden lg:flex absolute -left-7 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-white shadow-xl z-10 hover:bg-gray-50 transition-colors"
          >
            <MdChevronLeft size={32} />
          </button>

          <button
            onClick={() => handleScroll("right")}
            className="hidden lg:flex absolute -right-7 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center rounded-full bg-white shadow-xl z-10 hover:bg-gray-50 transition-colors"
          >
            <MdChevronRight size={32} />
          </button>
        </Fragment>
      )}
    </div>
  );
});

export default ImageSlider;
