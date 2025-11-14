import { useState } from "react";

import { googleProductSummary, aboutTags, googleComments } from "../constants/market";
import { kinoCasinoSlider } from "../constants/kino-casino/images";
import { description } from "../constants/kino-casino/description";
import { useTrackerContext } from "../context/tracker/useTrackerContext";
import { usePWAInstallContext } from "../context/pwa-install/usePWAInstallContext";

import { useUserAgent } from "../hooks/useUserAgent";

import gameLogo from "../assets/kino-casino/kino_pwa_2.1.webp";

import Loader from "../ui/Loader";
import InstructionsModal from "../components/modal/InstructionsModal";
import GoogleMarketLayout from "../components/layouts/GoogleMarketLayout";
import ProductImage from "../components/market/ProductImage";
import ProductDescription from "../components/market/google/ProductDescription";
import ProductSummary from "../components/market/google/ProductSummary";
import InstallButton from "../components/market/InstallButton";
import ProgressBar from "../components/market/ProgressBar";
import ProductSlider from "../components/market/ProductSlider";
import ProductAboutSection from "../components/market/ProductAboutSection";
import ProductReviews from "../components/market/google/ProductReviews";
import ProductComments from "../components/market/google/ProductComments";
import FullPictures from "../components/market/full-pictures";

const GoogleMarketPageV1 = () => {
  const [selectedPicture, setSelectedPicture] = useState<string>("");
  const [isFullSlider, setIsFullSlider] = useState<boolean>(false);

  const { isPWA } = useUserAgent();
  const { loading, handlePreparePWALink } = useTrackerContext();
  const { isInstalling, isInstalled, progress, handleInstallStart } = usePWAInstallContext();

  const handleInstall = () => {
    handlePreparePWALink();
    handleInstallStart();
  };

  const handleOpenPWA = () => {
    const url = `${window.location.origin}/?data=from-browser`;
    const a = document.createElement("a");

    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
  };

  if (isPWA) return <Loader />;

  return (
    <GoogleMarketLayout>
      <InstructionsModal />

      <div className="relative">
        <div className="absolute right-0 hidden md:block w-[200px] rounded-2xl overflow-hidden">
          <ProductImage image={gameLogo} />
        </div>

        <ProductDescription image={gameLogo} name="Kino Casino" creator="BetonWin" />

        <ProductSummary productSummary={googleProductSummary} />

        <div className="mb-8 md:mb-12">
          {!isInstalling && !isInstalled && (
            <InstallButton
              text="Instalar"
              variant="google"
              loading={loading.install}
              onClick={handleInstall}
              className="max-w-[200px]"
            />
          )}

          {isInstalling && (
            <div className="h-11 flex items-center">
              <ProgressBar variant="google" progress={progress} />
            </div>
          )}

          {!isInstalling && isInstalled && (
            <InstallButton
              text="OPEN"
              variant="google"
              onClick={handleOpenPWA}
              className="max-w-[200px]"
            />
          )}
        </div>
      </div>

      <ProductSlider
        setSelectedPicture={setSelectedPicture}
        setIsFullSlider={setIsFullSlider}
        pictures={kinoCasinoSlider}
        variant="google"
      />

      <ProductAboutSection texts={description} tags={aboutTags} variant="google" />

      <ProductReviews
        rating="4,8"
        reviews="126 thousand reviews"
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
          pictures={kinoCasinoSlider}
          variant="apple"
          setIsFullSlider={setIsFullSlider}
        />
      )}
    </GoogleMarketLayout>
  );
};

export default GoogleMarketPageV1;
