import { Routes, Route } from "react-router";

import GoogleMarketPageV1 from "../pages/GoogleMarketPageV1";
import ProductPage from "../pages/ProductPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<GoogleMarketPageV1 />} />
      <Route path="/product" element={<ProductPage />} />
    </Routes>
  );
};

export default AppRouter;
