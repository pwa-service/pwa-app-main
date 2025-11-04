import type { IGoogleCommentsData } from "../../../types/market";
import { classNames } from "../../../utils/classNames";

interface IGoogleMarketCommentsProps {
  comments: IGoogleCommentsData[];
}

const GoogleMarketComments = ({ comments }: IGoogleMarketCommentsProps) => {
  return (
    <div className="w-full flex flex-col mt-[40px]">
      {comments.map((comment) =>
        comment.type === "user" ? (
          <div key={comment.id} className="mb-[20px]">
            <div className="flex items-center">
              <img src={comment.avatar?.src} alt={comment.avatar?.alt} />

              <h2 className="ml-[14px] font-semibold sm:text-[14px] text-[#202124]">
                {comment.fullName}
              </h2>
            </div>

            <div className="flex items-center mt-[20px] mb-[15px]">
              <img src={comment.starImage?.src} alt={comment.starImage?.alt} />

              <p className="ml-[9px] sm:text-[13px] font-normal text-[#4C4D55]">
                {comment.date}
              </p>
            </div>

            <div>
              <p className="font-light sm:text-[12px] text-[#4C4D55] leading-[105%]">
                {comment.text}
              </p>
            </div>
          </div>
        ) : (
          <div
            key={comment.id}
            className={classNames(
              "w-full bg-[#F8F9FA]",
              "pt-[23px]",
              "sm:pl-[19px] mds:pl-[19px] md:pl-[19px] lg:pl-[30px]",
              "pr-[16px]",
              "pb-[23px] mb-[20px]"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold sm:text-[14px] text-[#202124]">
                {comment.fullName}
              </h2>

              <p className="sm:text-[13px] font-normal text-[#4C4D55]">
                {comment.date}
              </p>
            </div>

            <div className="mt-[23px]">
              <p className="font-light sm:text-[12px] text-[#4C4D55] leading-[105%]">
                {comment.text}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default GoogleMarketComments;
