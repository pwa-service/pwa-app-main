import { classNames } from "../../utils/classNames";

export type ButtonVariant = "google" | "apple";

interface InstallButtonProps {
  className?: string;
  text: string;
  loading?: boolean;
  onClick?: VoidFunction;
  disabled?: boolean;
  variant: ButtonVariant;
}

const InstallButton = ({
  text,
  loading = false,
  onClick,
  disabled,
  variant,
  className,
}: InstallButtonProps) => {
  let variantButtonStyles: string;

  switch (variant) {
    case "google":
      variantButtonStyles = `text-[16px] py-2.5 rounded-lg bg-[#00A173]`;
      break;

    case "apple":
      variantButtonStyles = `uppercase text-[14px] max-w-30 md:max-w-[200px] py-1.5 md:py-2 px-4 md:px-8 rounded-full bg-[#027BFF]`;
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "w-full",
        "text-white font-medium",
        "transition-all duration-300",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        variantButtonStyles,
        className
      )}
    >
      {loading ? "loading..." : text}
    </button>
  );
};

export default InstallButton;
