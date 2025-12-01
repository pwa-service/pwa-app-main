import type { AppleCommentData } from "../../../types/market";

interface IProductCommentsCommentsProps {
  comments: AppleCommentData[];
}

const ProductComments = ({ comments }: IProductCommentsCommentsProps) => {
  return (
    <div className="w-full flex flex-col">
      {comments.map(({ id, fullName, starsImage, date, text }) => (
        <div
          key={id}
          className="p-4 mt-4 rounded-lg bg-[#fff]"
          style={{ boxShadow: "0px 0px 10px 0px #00000026" }}
        >
          <h3 className="font-medium text-xl text-[#202124] mb-2">{fullName}</h3>

          <div className="flex items-center justify-between mb-2">
            <img src={starsImage.src} alt={starsImage.alt} />
            <p className="font-normal text-[#4C4D55]">{date}</p>
          </div>

          <p className="font-normal text-[#4C4D55] leading-[125%]">{text}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductComments;
