import { useState, useCallback, Suspense, lazy } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useIsPWA } from "../hooks/useIsPWA";

import { getQueryTail } from "../helpers/getQueryTail";

import { data } from "../constants/template";
import { googleSummary, tags, googleComments, reviews } from "../constants/market";

import Loader from "../ui/Loader";
import GoogleMarketLayout from "../components/layouts/GoogleMarketLayout";
import Description from "../components/markets/google/Description";
import Summary from "../components/markets/google/Summary";
import InstallButton from "../components/markets/InstallButton";
import ProgressBar from "../components/markets/ProgressBar";
import Slider from "../components/markets/Slider";
import AboutSection from "../components/markets/AboutSection";
import Reviews from "../components/markets/google/Reviews";
import Comments from "../components/markets/google/Comments";

const ExpandedGallery = lazy(() => import("../components/markets/ExpandedGallery"));

const GoogleMarketPage = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const { promptInstall, isInstalling, progress, isInstalled } = usePWAInstall();
  const { isPWA } = useIsPWA();

  const handleOpenPWA = async () => {
    const queryTail = await getQueryTail();
    const url = `${window.location.origin}/${queryTail}&data=from-browser`;
    console.log("open: ", url);

    window.open(url, "_blank", "noopener");
  };

  const handleSelectImage = useCallback((image: string) => {
    setSelectedImage(image);
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => setShowGallery(false), []);

  if (isPWA) return <Loader />;

  return (
    <GoogleMarketLayout>
      <div className="relative">
        <div className="absolute right-0 hidden md:block w-[200px] rounded-2xl overflow-hidden">
          <div className="relative">
            <img src={data.productImage} alt="" className="w-full h-full" />
          </div>
        </div>

        <Description
          productImage={data.productImage}
          productName={data.productName}
          productCreator={data.productCreator}
        />

        <Summary productSummary={googleSummary} />

        <div className="mb-8 md:mb-12">
          {isInstalling ? (
            <div className="h-11 flex items-center">
              <ProgressBar variant="google" progress={progress} />
            </div>
          ) : isInstalled ? (
            <InstallButton
              text="OPEN"
              variant="google"
              onClick={handleOpenPWA}
              className="max-w-[200px]"
            />
          ) : (
            <InstallButton
              text="Instalar"
              variant="google"
              onClick={promptInstall}
              className="max-w-[200px]"
            />
          )}
        </div>
      </div>

      <Slider variant="google" images={data.images} handleSelectImage={handleSelectImage} />
      <AboutSection variant="google" description={data.description} tags={tags} />
      <Reviews {...reviews} />
      <Comments comments={googleComments} />

      {showGallery && (
        <Suspense fallback={<div>Loading...</div>}>
          <ExpandedGallery
            images={data.images}
            selectedImage={selectedImage}
            onClose={handleCloseGallery}
          />
        </Suspense>
      )}
    </GoogleMarketLayout>
  );
};

export default GoogleMarketPage;
