import { classNames } from "../../utils/classNames";

import { MdOutlineVerifiedUser, MdStar } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { TbRating21Plus } from "react-icons/tb";

interface DescriptionProps {
  imageSRC: string;
  productName: string;
}

const Description = ({ imageSRC, productName }: DescriptionProps) => {
  return (
    <div className="relative flex-row md:flex-col gap-6 w-full mt-12">
      <div className="max-w-md w-full">
        <div className="flex gap-6">
          <div
            className={classNames(
              "md:absolute top-0 right-0",
              "w-20 md:w-[180px] xl:w-[240px]",
              "shrink-0 aspect-square overflow-hidden",
              "rounded-2xl md:rounded-4xl"
            )}
          >
            <img src={imageSRC} alt="product image" />
          </div>

          <div className="flex flex-col truncate">
            <div className="text-[clamp(2rem,5vw,4rem)] md:max-w-xl w-full">
              <h1 className="font-medium leading-none mr-10">{productName}</h1>
            </div>

            <div className="inline-flex items-center gap-1 mt-1 md:mt-4">
              <MdOutlineVerifiedUser className="w-4 h-4 text-emerald-600" />
              <p className="text-sm md:text-base text-zinc-500">Verified by Play Protect</p>
            </div>
          </div>
        </div>

        <div className={classNames("flex items-center mt-10 overflow-x-auto")}>
          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <div className="flex items-center gap-1">
              <span className="font-medium">4.4</span>
              <MdStar className="w-4 h-4" />
            </div>

            <span className="text-sm text-zinc-500">499 reviews</span>
          </div>

          <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />

          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <MdOutlineVerifiedUser className="w-5 h-5" />
            <span className="text-sm text-zinc-500">Editors Choise</span>
          </div>

          <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />

          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <FiDownload className="w-5 h-5" />
            <span className="text-sm text-zinc-500">6.9 MB</span>
          </div>

          <div className="shrink-0 w-px h-6 mx-3 bg-black/20" />

          <div className="h-12 flex flex-col items-center justify-between shrink-0 px-2">
            <TbRating21Plus className="w-5 h-5" />
            <span className="text-sm text-zinc-500">Rated fot 18+</span>
          </div>
        </div>
      </div>

      <button
        className={classNames(
          "h-10 xl:h-12 sm:max-w-[160px] xl:max-w-[200px] w-full",
          "mt-10 rounded-lg bg-emerald-600",
          "text-base xl:text-lg text-white font-medium"
        )}
      >
        Install
      </button>
    </div>
  );
};

export default Description;
