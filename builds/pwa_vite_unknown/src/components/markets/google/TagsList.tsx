import { classNames } from "../../../utils/classNames";

interface TagsListProps {
  tags: string[];
}

const TagsList = ({ tags }: TagsListProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 md:mb-10">
      {tags?.map((tag: string) => (
        <p
          key={tag}
          className={classNames(
            "flex items-center justify-between",
            "font-medium text-zinc-600",
            "py-1 px-6 rounded-full border border-zinc-300"
          )}
        >
          {tag}
        </p>
      ))}
    </div>
  );
};

export default TagsList;
