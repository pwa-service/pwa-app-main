import { Routes, Route } from "react-router";

import Google from "../pages/Google";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Google />} />
    </Routes>
  );
};

export default AppRouter;
