import { useEffect, Fragment } from "react";
import { useIsWebView } from "./hooks/useIsWebView";

import { getPWAData } from "./helpers/getPWAData";
import { redirectFromWebView } from "./helpers/redirectFromWebView";

import GlobalRedirect from "./components/GlobalRedirect";
import AppRouter from "./components/AppRouter";

getPWAData();

const App = () => {
  const { isWebView } = useIsWebView();

  useEffect(() => {
    if (isWebView) redirectFromWebView();
  }, [isWebView]);

  return (
    <Fragment>
      <GlobalRedirect />
      <AppRouter />
    </Fragment>
  );
};

export default App;
