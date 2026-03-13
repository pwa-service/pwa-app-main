import { lazy, Suspense, useState, useCallback, useMemo } from "react";

import { useIsPWA } from "../../../hooks/useIsPWA";
import { getPWAData } from "../../../helpers/getPWAData";

import Loader from "../../../ui/Loader";
import Description from "../components/Description";

import SectionContainer from "../components/SectionContainer";
import About from "../components/About";
import TagsList from "../components/About";
import DataSafetyList from "../components/DataSafetyList";

const ImageSlider = lazy(() => import("../components/ImageSlider"));
const ExpandedGallery = lazy(() => import("../components/ExpandedGallery"));
const Reviews = lazy(() => import("../components/Reviews"));
const Comments = lazy(() => import("../components/Comments"));

const GoogleMarketPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const images = useMemo(() => getPWAData("galleryUrls") || [], []);

  const { isPWA } = useIsPWA();

  const handleOpenGallery = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);

  const handleCloseGallery = useCallback(() => setSelectedImage(null), []);

  if (isPWA) return <Loader />;

  return (
    <main className="max-w-screen-xl w-full mx-auto p-6 sm:p-10">
      <Description />

      <Suspense fallback={<div className="w-full h-[250px] md:h-[450px] mt-6" />}>
        <ImageSlider images={images} onSelectImage={handleOpenGallery} />
      </Suspense>

      {selectedImage && (
        <Suspense fallback={null}>
          <ExpandedGallery
            images={images}
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
