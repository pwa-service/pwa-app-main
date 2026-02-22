import { lazy, Suspense, useState, useCallback } from "react";
import { useIsPWA } from "../hooks/useIsPWA";
import { data } from "../constants/template";

import Loader from "../ui/Loader";
import Description from "../components/markets/google/Description";
import { getPWAData } from "../helpers/getPWAData";

import SectionContainer from "../components/markets/google/SectionContainer";
import About from "../components/markets/google/About";
import TagsList from "../components/markets/google/TagsList";
import DataSafetyList from "../components/markets/google/DataSafetyList";

const ImageSlider = lazy(() => import("../components/markets/google/ImageSlider"));
const ExpandedGallery = lazy(() => import("../components/markets/ExpandedGallery"));
const Reviews = lazy(() => import("../components/markets/google/Reviews"));
const Comments = lazy(() => import("../components/markets/google/Comments"));

const GoogleMarketPage = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const { isPWA } = useIsPWA();

  const handleSelectImage = useCallback((image: string) => {
    setSelectedImage(image);
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => setShowGallery(false), []);

  const iconUrl = getPWAData("iconUrl");
  const galleryUrls = getPWAData("galleryUrls");

  const displayIcon = iconUrl || data.productImage;
  const displayImages = (galleryUrls && galleryUrls.length > 0)
    ? galleryUrls.map((url, i) => ({ src: url, alt: `gallery-image-${i}` }))
    : data.images;

  if (isPWA) return <Loader />;

  return (
    <main className="max-w-screen-xl w-full mx-auto p-6 sm:p-10">
      <Description imageSRC={displayIcon} />

      <Suspense fallback={<div className="w-full h-[250px] md:h-[450px] mt-6" />}>
        <ImageSlider
          images={displayImages}
          handleSelectImage={handleSelectImage}
          showGallery={showGallery}
        />
      </Suspense>

      {showGallery && (
        <Suspense fallback={null}>
          <ExpandedGallery
            images={displayImages}
            selectedImage={selectedImage}
            onClose={handleCloseGallery}
          />
        </Suspense>
      )}

      <SectionContainer title="About this up">
        <About />
        <TagsList />
      </SectionContainer>

      <SectionContainer title="Data safety">
        <p className="text-zinc-600">
          Safety starts with understanding how developers collect and share your data. Data privacy
          and security practices may vary based on your use, region, and age. The developer provided
          this information and may update it over time.
        </p>

        <DataSafetyList />
      </SectionContainer>

      <SectionContainer title="Rating and reviews">
        <Suspense fallback={null}>
          <Reviews />
        </Suspense>
      </SectionContainer>

      <Suspense fallback={null}>
        <Comments />
      </Suspense>
    </main>
  );
};

export default GoogleMarketPage;
