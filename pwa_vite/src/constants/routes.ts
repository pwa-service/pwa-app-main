import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";

import GoogleMarketPageV1 from "../pages/GoogleMarketPageV1";
import GoogleMarketPageV2 from "../pages/GoogleMarketPageV2";

import AppleMarketPageV1 from "../pages/AppleMarketPageV1";
import AppleMarketPageV2 from "../pages/AppleMarketPageV2";

export const routes = [
  { path: "/", element: HomePage },
  { path: "/landing", element: LandingPage },

  { path: "/google-market-v1", element: GoogleMarketPageV1 },
  { path: "/google-market-v2", element: GoogleMarketPageV2 },

  { path: "/apple-market-v1", element: AppleMarketPageV1 },
  { path: "/apple-market-v2", element: AppleMarketPageV2 },
];
