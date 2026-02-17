import { classNames } from "../../../utils/classNames";

interface TagsListProps {
  tags: { text: string }[];
}

const TagsList = ({ tags }: TagsListProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 md:mb-10">
      {tags?.map(({ text }, index) => (
        <p
          key={index}
          className={classNames(
            "flex items-center justify-between",
            "font-medium text-zinc-600 capitalize",
            "py-1 px-6 rounded-full border border-zinc-300"
          )}
        >
          {text}
        </p>
      ))}
    </div>
  );
};

export default TagsList;
