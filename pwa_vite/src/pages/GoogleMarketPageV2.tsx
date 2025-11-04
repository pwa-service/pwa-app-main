import { useState } from "react";
import {
  googleProductSummary,
  sliderImagesV2,
  aboutTexts,
  aboutTags,
  googleComments,
} from "../constants/market";

import gameLogo from "../assets/market/game-logo-v2.svg";

import GoogleMarketLayout from "../components/layouts/GoogleMarketLayout";
import ProductImage from "../components/market/ProductImage";
import ProductDescription from "../components/market/google/ProductDescription";
import ProductSummary from "../components/market/google/ProductSummary";
import InstallButton from "../components/market/InstallButton";
import ProductSlider from "../components/market/ProductSlider";
import ProductAboutSection from "../components/market/ProductAboutSection";
import ProductReviews from "../components/market/google/ProductReviews";
import ProductComments from "../components/market/google/ProductComments";
import FullPictures from "../components/market/full-pictures";

const GoogleMarketPageV2 = () => {
  const [isFullSlider, setIsFullSlider] = useState<boolean>(false);
  const [selectedPicture, setSelectedPicture] = useState<string>("");

  return (
    <GoogleMarketLayout>
      <div className="relative">
        <div className="absolute right-0 hidden md:block w-[200px] rounded-2xl overflow-hidden">
          <ProductImage image={gameLogo} />
        </div>

        <ProductDescription
          image={gameLogo}
          name="Coin Volcano"
          creator="BETONWIN"
          subtitle="Contiene ADS - Compras en la aplication"
        />

        <ProductSummary productSummary={googleProductSummary} />

        <div className="my-6 md:my-12">
          <InstallButton
            text="Instalar"
            variant="google"
            onClick={() => console.log("test")}
            className="max-w-[200px]"
          />
        </div>
      </div>

      <ProductSlider
        setSelectedPicture={setSelectedPicture}
        setIsFullSlider={setIsFullSlider}
        pictures={sliderImagesV2}
        variant="google"
      />

      <ProductAboutSection
        texts={aboutTexts}
        tags={aboutTags}
        variant="google"
      />

      <ProductReviews
        rating="4,9"
        reviews={"126 thousand reviews"}
        percentA={95}
        percentB={13}
        percentC={8}
        percentD={5}
        percentE={3}
      />

      <ProductComments comments={googleComments} />

      {isFullSlider && (
        <FullPictures
          selectedPicture={selectedPicture}
          pictures={sliderImagesV2}
          variant="apple"
          setIsFullSlider={setIsFullSlider}
        />
      )}
    </GoogleMarketLayout>
  );
};

export default GoogleMarketPageV2;
