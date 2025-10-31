import { Routes, Route } from "react-router";
import { routes } from "../constants/routes";

const AppRouter = () => {
  return (
    <Routes>
      {routes.map(({ path, element: Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
};

export default AppRouter;
