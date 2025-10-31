import { Routes, Route } from "react-router";

import GoogleMarketPageV1 from "../pages/GoogleMarketPageV1";
import HomePage from "../pages/HomePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apps/:pwa" element={<GoogleMarketPageV1 />} />
    </Routes>
  );
};

export default AppRouter;
