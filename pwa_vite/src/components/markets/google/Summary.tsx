import type { ProductSummaryData } from "../../../types/market";

import { memo, Fragment } from "react";
import { classNames } from "../../../utils/classNames";

interface SummaryProps {
  productSummary: ProductSummaryData[];
}

const Summary = memo(({ productSummary }: SummaryProps) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-around",
        "min-w-0 md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] w-full",
        "overflow-x-auto pb-1 mb-6 md:mb-8"
      )}
    >
      {productSummary.map(({ id, value, label, icon }, index) => {
        const isLast = index === productSummary.length - 1;

        return (
          <Fragment key={id}>
            <div className="h-12 flex flex-col items-center justify-between shrink-0 px-4">
              <div className="flex-1 flex items-center gap-px justify-center">
                {value && <p className="font-medium text-[#0D0D0D] sm:mt-0 xl:mt-[3px]">{value}</p>}

                {icon && <img src={icon} alt="star" className="" />}
              </div>

              <p className="font-normal text-[#5C5C5C] text-sm shrink-0">{label}</p>
            </div>

            {!isLast && <div className="shrink-0 w-px h-8 mx-3 bg-black/50" />}
          </Fragment>
        );
      })}
    </div>
  );
});

export default Summary;
