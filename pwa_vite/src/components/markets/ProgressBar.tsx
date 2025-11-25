import { Fragment } from "react";
import { classNames } from "../../utils/classNames";

export type Variants = "google" | "apple";

interface ProgressBarProps {
  variant: Variants;
  progress: number;
  containerClassName?: string;
  progressBarClassName?: string;
  showPercentage?: boolean;
  ariaLabel?: string;
}

const ProgressBar = ({
  variant,
  progress,
  containerClassName,
  progressBarClassName,
  showPercentage = false,
  ariaLabel = "",
}: ProgressBarProps) => {
  let variantStyles: string;

  switch (variant) {
    case "google":
      variantStyles = "rounded bg-[#00A173]";
      break;

    case "apple":
      variantStyles = "rounded-xl bg-[#4586DAFF]";
      break;
  }

  return (
    <Fragment>
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className={classNames(
          "relative w-full h-3 rounded bg-gray-200/60 overflow-hidden",
          containerClassName
        )}
      >
        <div
          className={classNames(
            "h-full absolute left-0 top-0",
            "transition-all duration-300 ease-out",
            variantStyles,
            progressBarClassName
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {showPercentage && (
        <div className="flex items-center justify-end mt-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      )}
    </Fragment>
  );
};

export default ProgressBar;
