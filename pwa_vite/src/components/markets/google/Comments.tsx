import type { GoogleCommentData } from "../../../types/market";

import { memo } from "react";

interface CommentsProps {
  comments: GoogleCommentData[];
}

const Comments = memo(({ comments }: CommentsProps) => {
  return (
    <div className="w-full flex flex-col mb-10">
      {comments.map(({ type, id, avatar, fullName, starImage, date, text }) =>
        type === "user" ? (
          <div key={id} className="flex flex-col gap-2 mt-12">
            <div className="flex items-center gap-4">
              <img src={avatar?.src} alt={avatar?.alt} className="w-10 h-10" />

              <h2 className="font-semibold text-[#202124] text-xl">{fullName}</h2>
            </div>

            <div className="flex items-center justify-between">
              <img src={starImage?.src} alt={starImage?.alt} />
              <p className="font-normal text-[#4C4D55]">{date}</p>
            </div>

            <p className="text-[#4C4D55] leading-[105%]">{text}</p>
          </div>
        ) : (
          <div key={id} className="w-full flex flex-col gap-2 p-6 bg-[#F8F9FA] mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#202124] text-xl">{fullName}</h2>

              <p className="font-normal text-[#4C4D55]">{date}</p>
            </div>

            <p className="font-light text-[#4C4D55] leading-[105%]">{text}</p>
          </div>
        )
      )}
    </div>
  );
});

export default Comments;
