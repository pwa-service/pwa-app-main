import starsIcon from "../../../assets/markets/apple/apple_five_stars.svg";

interface IProductReviewsProps {
  ratting: number;
  reviews: string;
}

const ProductReviews = ({ ratting, reviews }: IProductReviewsProps) => {
  return (
    <div className="flex flex-col mb-6 md:mb-10">
      <h1 className="text-[#0D0D0D] text-2xl font-medium mb-4">Ratings & Reviews</h1>

      <h1 className="font-semibold text-[#0D0D0D] text-7xl mb-2">{ratting}</h1>

      <div>
        <img src={starsIcon} alt="stars" />
      </div>

      <p className="font-medium text-[#AAAAAA]">{reviews}</p>
    </div>
  );
};

export default ProductReviews;
