import { Fragment } from "react";

import { usePWAInstall } from "../../../hooks/usePWAInstall";

import ProductImage from "../ProductImage";
import checkIcon from "../../../assets/markets/check.svg";
import InstallButton from "../InstallButton";
import ProgressBar from "../ProgressBar";

interface IProductDescriptionProps {
  image: string;
  name: string;
  creator: string;
}

const ProductDescription = ({ image, name, creator }: IProductDescriptionProps) => {
  const { promptInstall, isInstalling, progress, isInstalled } = usePWAInstall();

  const handleOpenPWA = () => {
    const url = `${window.location.origin}/?data=from-browser`;
    const a = document.createElement("a");

    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
  };

  return (
    <Fragment>
      <div className="flex items-center gap-4 md:gap-8 mb-8">
        <div className="w-30 md:w-50 rounded-2xl overflow-hidden">
          <ProductImage image={image} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="mb-2 md:mb-4">
            <div className="flex items-end gap-3">
              <h1 className="text-3xl md:text-5xl 2xl:text-6xl font-medium">{name}</h1>

              <img src={checkIcon} alt="check" className="w-6 md:w-8 h-6 md:h-8 mb-0.5 lg:mb-1" />
            </div>

            <h2 className="text-[#797979] uppercase font-medium text-lg">{creator}</h2>
          </div>

          <div className="w-full mb-8 md:mb-12">
            {isInstalling ? (
              <div className="h-11 flex items-center">
                <ProgressBar variant="google" progress={progress} />
              </div>
            ) : isInstalled ? (
              <InstallButton
                text="OPEN"
                variant="apple"
                onClick={handleOpenPWA}
                className="max-w-[200px]"
              />
            ) : (
              <InstallButton
                text="Instalar"
                variant="apple"
                onClick={promptInstall}
                className="max-w-[200px]"
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDescription;
