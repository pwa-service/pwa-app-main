import { Routes, Route } from "react-router";

import GoogleMarketPage from "../pages/GoogleMarketPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<GoogleMarketPage />} />
    </Routes>
  );
};

export default AppRouter;
