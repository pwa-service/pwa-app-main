import { Fragment } from "react/jsx-runtime";
import type { ProductSummaryData } from "../../../types/market";
import { classNames } from "../../../utils/classNames";

interface IProductSummaryProps {
  productSummary: ProductSummaryData[];
}

const ProductSummary = ({ productSummary }: IProductSummaryProps) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-around gap-4",
        "min-w-0 max-w-full overflow-x-auto",
        "py-2 mb-6 md:mb-8 border-t border-b border-[#AAAAAA]"
      )}
    >
      {productSummary.map(({ id, value, label, icon, description }, index) => {
        const isLast = index === productSummary.length - 1;

        return (
          <Fragment key={id}>
            <div className="h-16 flex flex-col items-center justify-between shrink-0 px-4">
              <p className="font-normal text-[#AAAAAA] sm:text-[10px]">{label}</p>

              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="font-medium text-[#AAAAAA] sm:text-[16px] uppercase">{value}</p>

                {icon && <img src={icon} alt="star" className="h-5 w-16" />}
              </div>

              {description && <p className="font-normal text-[#AAAAAA] text-sm">{description}</p>}
            </div>

            {!isLast && <div className="w-[1px] h-12 shrink-0 mx-3 bg-[#AAAAAA]" />}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ProductSummary;
