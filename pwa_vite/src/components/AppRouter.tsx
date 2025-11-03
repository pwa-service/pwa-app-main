import { Routes, Route } from "react-router";

import GoogleMarketPageV1 from "../pages/GoogleMarketPageV1";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<GoogleMarketPageV1 />} />
    </Routes>
  );
};

export default AppRouter;
