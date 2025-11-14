import { useState } from "react";
import {
  appleProductSummary,
  sliderImagesV2,
  aboutTexts,
  appleComments,
} from "../constants/market";

import gameLogo from "../assets/market/game-logo-v2.svg";

import AppleMarketTemplate from "../components/layouts/AppleMarketLayout";
import ProductImage from "../components/market/ProductImage";
import ProductDescription from "../components/market/apple/ProductDescription";
import ProductSummary from "../components/market/apple/ProductSummary";
import InstallButton from "../components/market/InstallButton";
import ProductSlider from "../components/market/ProductSlider";
import ProductAboutSection from "../components/market/ProductAboutSection";
import ProductReviews from "../components/market/apple/ProductReviews";
import ProductComments from "../components/market/apple/ProductComments";
import FullPictures from "../components/market/full-pictures";

const AppleMarketPageV2 = () => {
  const [isFullSlider, setIsFullSlider] = useState<boolean>(false);
  const [selectedPicture, setSelectedPicture] = useState<string>("");

  return (
    <AppleMarketTemplate>
      <div className="relative">
        <div className="absolute right-0 hidden md:block w-[200px] rounded-2xl overflow-hidden">
          <ProductImage image={gameLogo} />
        </div>

        <ProductDescription
          image={gameLogo}
          name="Coin Volcano"
          creator="BETONWIN"
        />

        <ProductSummary productSummary={appleProductSummary} />

        <div className="my-6 md:my-8">
          <InstallButton
            text="Instalar"
            variant="apple"
            onClick={() => console.log("test")}
            className="max-w-[200px]"
          />
        </div>
      </div>

      <h1 className="text-[#0D0D0D] font-semibold mb-[20px] mt-[20px] sm:text-[18px]">
        Preview
      </h1>

      <ProductSlider
        setSelectedPicture={setSelectedPicture!}
        pictures={sliderImagesV2}
        variant="apple"
        setIsFullSlider={setIsFullSlider}
      />

      <ProductAboutSection texts={aboutTexts} variant="apple" />

      <ProductReviews ratting="4.7" reviews="21K Ratings" />

      <ProductComments comments={appleComments} />

      {isFullSlider && (
        <FullPictures
          selectedPicture={selectedPicture}
          pictures={sliderImagesV2}
          variant="apple"
          setIsFullSlider={setIsFullSlider}
        />
      )}
    </AppleMarketTemplate>
  );
};

export default AppleMarketPageV2;
