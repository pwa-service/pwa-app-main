import type { IAppleCommentsData } from "../../../types/market";

interface IAppleMarketCommentsProps {
  comments: IAppleCommentsData[];
}

const AppleMarketComments = ({ comments }: IAppleMarketCommentsProps) => {
  return (
    <div>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="p-[15px] mb-[20px] rounded-2xl bg-[#fff]"
          style={{ boxShadow: "0px 0px 20.7px 0px #00000026" }}
        >
          <h3 className="font-medium sm:text-[14px] text-[#202124]">
            {comment.fullName}
          </h3>

          <div className="flex items-center">
            <img
              src={comment.starsImage.src}
              alt={comment.starsImage.alt}
              className="sm:w-[61px] sm:h-[11px]"
            />

            <p className="ml-[10px] font-normal sm:text-[12px] text-[#4C4D55]">
              {comment.date}
            </p>
          </div>

          <p className="font-normal sm:text-[12px] text-[#4C4D55] leading-[105%]">
            {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AppleMarketComments;
