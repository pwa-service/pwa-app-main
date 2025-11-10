import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { classNames } from "../../utils/classNames";

interface IPicture {
  src: string;
  alt?: string;
}

interface IProps {
  pictures: IPicture[];
  variant: "apple" | "google";
  setIsFullSlider: Dispatch<SetStateAction<boolean>>;
  selectedPicture: string;
}

const FullPictures = ({
  pictures,
  // variant,
  setIsFullSlider,
  selectedPicture,
}: IProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = pictures.findIndex((pic) => pic.src === selectedPicture);

    if (scrollContainerRef.current && index !== -1) {
      const container = scrollContainerRef.current;
      const slideWidth = container.offsetWidth;
      container.scrollLeft = index * slideWidth;
    }
  }, [selectedPicture, pictures]);

  return (
    <div
      className={classNames(
        "w-full h-screen p-5 bg-black",
        "fixed top-0 left-0 z-10",
        "text-white"
      )}
    >
      <button
        onClick={() => setIsFullSlider(false)}
        className="absolute left-[20px] top-[20px] mb-[20px] z-20"
      >
        Done
      </button>

      <div
        ref={scrollContainerRef}
        className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {pictures.map((picture, index) => (
          <div
            key={index}
            className="w-full h-[80%] snap-center flex items-center justify-center shrink-0"
          >
            <img
              src={picture.src}
              alt={picture.alt}
              className="w-full h-full object-contain p-[5px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullPictures;
