import { Fragment, memo } from "react";

import ProductImage from "../ProductImage";
import checkIcon from "../../../assets/markets/check.svg";

interface DescriptionProps {
  productImage: string;
  productName: string;
  productCreator: string;
  subtitle?: string;
}

const Description = memo(
  ({ productImage, productName, productCreator, subtitle }: DescriptionProps) => {
    return (
      <Fragment>
        <div className="flex items-center gap-4 mb-4 md:mb-8">
          <div className="md:hidden w-30">
            <ProductImage image={productImage} className="" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-end gap-3 md:mb-4">
              <h1 className="text-3xl md:text-5xl 2xl:text-6xl font-medium">{productName}</h1>

              <img src={checkIcon} alt="check" className="w-6 md:w-8 h-6 md:h-8 mb-0.5 lg:mb-1" />
            </div>

            <h2 className="text-[#00A173] uppercase font-medium text-lg">{productCreator}</h2>

            {subtitle && <p className="font-normal text-[#5C5C5C] text-sm">{subtitle}</p>}
          </div>
        </div>
      </Fragment>
    );
  }
);

export default Description;
