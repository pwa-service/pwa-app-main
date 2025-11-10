import { classNames } from "../../utils/classNames";

interface IProductAboutSectionProps {
  texts: string[];
  tags?: string[];
  variant: "google" | "apple";
}

const ProductAboutSection = ({
  texts,
  tags,
  variant,
}: IProductAboutSectionProps) => {
  return (
    <div>
      <h1 className="font-medium text-2xl mb-2">
        {variant === "google" ? "Sobre este juego" : "What’s New"}
      </h1>

      <div
        className={classNames(
          "max-w-2xl w-full",
          variant === "google" ? "mb-4" : "mb-8"
        )}
      >
        {texts.map((element: string, index: number) => (
          <p key={index} className="text-[#5C5C5C] font-medium uppercase">
            {element}
          </p>
        ))}
      </div>

      {variant === "google" && (
        <div className="flex flex-wrap gap-3 mb-6 md:mb-10">
          {tags?.map((tag: string) => (
            <p
              key={tag}
              className={classNames(
                "flex items-center justify-between",
                "font-medium text-[#5C5C5C]",
                "py-0.5 px-4 rounded-[76px] border border-[#5C5C5C]"
              )}
            >
              {tag}
            </p>
          ))}
        </div>
      )}

      {variant === "google" && (
        <div className="max-w-lg w-full mb-6 md:mb-10">
          <h1 className="text-2xl font-medium mb-2">Data Security</h1>

          <p className="font-medium text-[#5C5C5C] leading-[125%] mb-4">
            Your safety is paramount at Ultimate Casino Experience. We utilize
            top-tier encryption and security protocols to protect your data.
          </p>

          <p className="font-medium text-[#5C5C5C] leading-[125%]">
            Transactions are secure and fast, ensuring your information remains
            private. Play with confidence in a safe, continuously updated
            environment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductAboutSection;
