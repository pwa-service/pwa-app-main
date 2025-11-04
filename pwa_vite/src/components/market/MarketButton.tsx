import { classNames } from "../../utils/classNames";

export type ButtonVariant = "google" | "apple";

interface IMarketButtonProps {
  buttonStyles?: string;
  text: string;
  onClick: VoidFunction;
  variant: ButtonVariant;
}

const MarketButton = ({
  buttonStyles = "",
  text,
  onClick,
  variant = "google",
}: IMarketButtonProps) => {
  let variantButtonStyles: string;

  switch (variant) {
    case "google":
      variantButtonStyles = `text-white bg-[#00A173] text-[16px] mt-[15px] mb-[20px] w-full h-[35px]`;
      break;

    case "apple":
      variantButtonStyles = `text-white bg-[#027BFF] text-[14px] mt-[10px] sm:w-[110px] sm:h-[30px] uppercase`;
      break;
  }

  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-[100px]",
        "transition-all duration-300 font-medium",
        variantButtonStyles,
        buttonStyles
      )}
    >
      {text}
    </button>
  );
};

export default MarketButton;
