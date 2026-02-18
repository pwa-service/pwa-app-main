import { classNames } from "../../utils/classNames";

interface InstallButtonProps {
  label: string;
  onClick?: VoidFunction;
  disabled?: boolean;
  className?: string;
}

const InstallButton = ({ label, onClick, disabled, className }: InstallButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "h-9 xl:h-11 sm:max-w-[160px] xl:max-w-[200px] w-full",
        "mt-6 md:mt-10 rounded-lg bg-emerald-700/90",
        "text-base xl:text-lg text-white font-medium",
        className
      )}
    >
      {label}
    </button>
  );
};

export default InstallButton;
