import { useState, useCallback, Suspense, lazy } from "react";

import { data } from "../constants/template";
import { appleSummary, appleComments, reviews } from "../constants/market";

import AppleMarketLayout from "../components/layouts/AppleMarketLayout";
import ProductDescription from "../components/markets/apple/ProductDescription";
import ProductSummary from "../components/markets/apple/ProductSummary";
import ProductSlider from "../components/markets/Slider";
import ProductAboutSection from "../components/markets/AboutSection";
import ProductReviews from "../components/markets/apple/ProductReviews";
import ProductComments from "../components/markets/apple/ProductComments";

const ExpandedGallery = lazy(() => import("../components/markets/ExpandedGallery"));

const AppleMarketPage = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const handleSelectImage = useCallback((image: string) => {
    setSelectedImage(image);
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => setShowGallery(false), []);

  return (
    <AppleMarketLayout>
      <ProductDescription
        image={data.productImage}
        name={data.productName}
        creator={data.productCreator}
      />

      <ProductSummary productSummary={appleSummary} />

      <ProductSlider images={data.images} variant="apple" handleSelectImage={handleSelectImage} />

      <ProductAboutSection description={data.description} variant="apple" />
      <ProductReviews ratting={reviews.rating} reviews={reviews.reviews} />
      <ProductComments comments={appleComments} />

      {showGallery && (
        <Suspense fallback={<div>Loading...</div>}>
          <ExpandedGallery
            images={data.images}
            selectedImage={selectedImage}
            onClose={handleCloseGallery}
          />
        </Suspense>
      )}
    </AppleMarketLayout>
  );
};

export default AppleMarketPage;
