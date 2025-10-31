import { classNames } from "../../../utils/classNames";

import starsIcon from "../../../assets/market/google-five-stars.svg";

interface IGoogleMarketReviewsProps {
  rating: string;
  percentA: number;
  percentB: number;
  percentC: number;
  percentD: number;
  percentE: number;
  reviews: string;
}

const GoogleMarketReviews = ({
  rating,
  reviews,
  percentA,
  percentB,
  percentC,
  percentD,
  percentE,
}: IGoogleMarketReviewsProps) => {
  const percents = [percentA, percentB, percentC, percentD, percentE];

  return (
    <div>
      <h1 className="font-semibold sm:text-[16px] text-[#000] mt-[40px]">
        Ratings and reviews
      </h1>

      <div className="w-full h-[112px] flex">
        <div className="w-[111px] h-full flex flex-col justify-between">
          <h1 className="text-[50px] font-medium text-[#202124]">{rating}</h1>

          <img
            src={starsIcon}
            alt="five_stars"
            className="sm:w-[64px] mb-[12px]"
          />

          <p className="font-normal text-[10px] text-[#5C5C5C]">{reviews}</p>
        </div>

        <div
          className={classNames(
            "h-full",
            "sm:w-[50%] mds:w-[50%] md:w-[50%] lg:w-[68%]",
            "flex justify-end flex-col gap-[10px]",
            "sm:ml-[28px] mds:ml-[60px] md:ml-[100px] xl:ml-[150px]"
          )}
        >
          {percents.map((percent, index) => (
            <div
              key={index}
              className="relative w-full h-[10px] rounded-[90px] bg-[#D9D9D9]"
            >
              <span
                className={classNames(
                  "absolute left-[-10px] top-1/2 -translate-y-1/2",
                  "text-[9px] text-[#5C5C5C]"
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
    </div>
  );
};

export default GoogleMarketReviews;
