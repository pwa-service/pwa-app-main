import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

const GoogleMarketPage = lazy(() =>
  import("../modules/google-market").then((module) => ({
    default: module.GoogleMarketPage,
  }))
);

import Loader from "../ui/Loader";

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<GoogleMarketPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
