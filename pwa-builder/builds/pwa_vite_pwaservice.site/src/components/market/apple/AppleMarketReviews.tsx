import starsIcon from "../../../assets/market/apple-five-stars.svg";

interface IAppleMarketReviewsProps {
  ratting: string;
  reviews: string;
}

const AppleMarketReviews = ({ ratting, reviews }: IAppleMarketReviewsProps) => {
  return (
    <div>
      <h1 className="font-semibold sm:text-[18px] text-[#0D0D0D] mt-[40px] ">
        Ratings & Reviews
      </h1>

      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-[#0D0D0D] sm:text-[80px]">
          {ratting}
        </h1>

        <div className="flex flex-col justify-end gap-[7px] text-end mt-[10px]">
          <img
            src={starsIcon}
            alt="stars"
            className="sm:w-[102px] sm:h-[19px]"
          />

          <p className="font-medium text-[#AAAAAA] sm:text-[14px]">{reviews}</p>
        </div>
      </div>
    </div>
  );
};

export default AppleMarketReviews;
