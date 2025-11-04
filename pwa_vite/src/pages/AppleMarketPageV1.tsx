import { useState } from "react";
import {
  appleProductSummary,
  sliderImagesV1,
  aboutTexts,
  appleComments,
} from "../constants/market";

import gameLogo from "../assets/market/game-logo.svg";

import AppleMarketLayout from "../components/layouts/AppleMarketLayout";
import ProductDescription from "../components/market/apple/ProductDescription";
import ProductSummary from "../components/market/apple/ProductSummary";
import ProductSlider from "../components/market/ProductSlider";
import ProductAboutSection from "../components/market/ProductAboutSection";
import ProductReviews from "../components/market/apple/ProductReviews";
import ProductComments from "../components/market/apple/ProductComments";
import FullPictures from "../components/market/full-pictures";

const AppleMarketPageV1 = () => {
  const [isFullSlider, setIsFullSlider] = useState<boolean>(false);
  const [selectedPicture, setSelectedPicture] = useState<string>("");

  return (
    <AppleMarketLayout>
      <ProductDescription image={gameLogo} name="Coin Volcano" creator="BETONWIN" />

      <ProductSummary productSummary={appleProductSummary} />

      <ProductSlider
        setSelectedPicture={setSelectedPicture!}
        pictures={sliderImagesV1}
        variant="apple"
        setIsFullSlider={setIsFullSlider}
      />

      <ProductAboutSection texts={aboutTexts} variant="apple" />
      <ProductReviews ratting="4.7" reviews="21K Ratings" />
      <ProductComments comments={appleComments} />

      {isFullSlider && (
        <FullPictures
          selectedPicture={selectedPicture}
          pictures={sliderImagesV1}
          variant="apple"
          setIsFullSlider={setIsFullSlider}
        />
      )}
    </AppleMarketLayout>
  );
};

export default AppleMarketPageV1;
