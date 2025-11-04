import { Fragment } from "react";
import { loadPWAData } from "./helpers/loadPWAData";

import AppRouter from "./components/AppRouter";
import GlobalRedirect from "./components/GlobalRedirect";

loadPWAData();

const App = () => {
  return (
    <Fragment>
      <GlobalRedirect />s
      <AppRouter />
    </Fragment>
  );
};

export default App;
