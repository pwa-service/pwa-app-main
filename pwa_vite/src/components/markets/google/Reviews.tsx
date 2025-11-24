import { memo } from "react";
import { classNames } from "../../../utils/classNames";

import starsIcon from "../../../assets/markets/google/google_five_stars.svg";

interface ReviewsProps {
  rating: number;
  percentA: number;
  percentB: number;
  percentC: number;
  percentD: number;
  percentE: number;
  reviews: string;
}

const Reviews = memo(
  ({ rating, reviews, percentA, percentB, percentC, percentD, percentE }: ReviewsProps) => {
    const percents = [percentA, percentB, percentC, percentD, percentE];

    return (
      <div className="flex flex-col mb-6 md:mb-10">
        <h1 className="text-2xl font-medium mb-8">Ratings and reviews</h1>

        <div className="w-full flex items-center gap-10 mb-2">
          <div className="h-full flex flex-col gap-2">
            <h1 className="text-6xl font-medium text-[#202124]">{rating}</h1>
            <img src={starsIcon} alt="five_stars" />
          </div>

          <div className={classNames("w-full h-full", "flex flex-col justify-end gap-3")}>
            {percents.map((percent, index) => (
              <div key={index} className="relative w-full h-3 rounded-[90px] bg-[#D9D9D9]">
                <span
                  className={classNames(
                    "absolute -left-4 top-1/2 -translate-y-1/2",
                    "text-sm text-[#5C5C5C]"
                  )}
                >
                  {5 - index}
                </span>

                <div
                  className="h-full rounded-[90px] bg-[#3B8562]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="font-normal text-sm text-[#5C5C5C]">{reviews}</p>
      </div>
    );
  }
);

export default Reviews;
