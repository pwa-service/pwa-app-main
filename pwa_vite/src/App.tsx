import { useEffect, Fragment } from "react";
import { useIsWebView } from "./hooks/useIsWebView";

import { loadPWAData } from "./helpers/loadPWAData";
import { redirectFromWebView } from "./helpers/redirectFromWebView";

import AppRouter from "./components/AppRouter";
import GlobalRedirect from "./components/GlobalRedirect";

loadPWAData();

const App = () => {
  const { isWebView } = useIsWebView();

  useEffect(() => {
    if (isWebView) redirectFromWebView();
  }, [isWebView]);

  return (
    <Fragment>
      <GlobalRedirect />s
      <AppRouter />
    </Fragment>
  );
};

export default App;
