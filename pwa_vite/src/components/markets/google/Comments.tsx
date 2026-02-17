import { memo } from "react";

import Stars from "./Stars";

interface CommentsProps {
  comments: {
    author: string;
    text: string;
    type: string;
  }[];
}

const Comments = memo(({ comments }: CommentsProps) => {
  return (
    <div className="w-full flex flex-col gap-10 mt-16">
      {comments.map(({ type, author, text }, index) =>
        type === "user" ? (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-zinc-800">{author}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Stars size={12} className="gap-0.5 text-[#3B8562]" />
              {/* <p className="text-xs text-zinc-600">{date}</p> */}
            </div>

            <p className="text-zinc-600 text-sm">{text}</p>
          </div>
        ) : (
          <div
            key={index}
            className="w-full flex flex-col gap-2 p-4 -mt-4 rounded-lg bg-blue-100/30"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="font-medium text-zinc-800">{author}</span>
              <p className="text-xs text-zinc-600">{author}</p>
            </div>

            <p className="text-zinc-600 text-sm">{text}</p>
          </div>
        )
      )}
    </div>
  );
});

export default Comments;
