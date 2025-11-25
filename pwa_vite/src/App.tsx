import { useEffect, Fragment } from "react";
import { useIsWebView } from "./hooks/useIsWebView";

import { redirectFromWebView } from "./helpers/redirectFromWebView";

import AppRouter from "./components/AppRouter";
import { useSmartLook } from "./hooks/useSmartLook";

const App = () => {
  const { isWebView } = useIsWebView();
  useSmartLook();

  useEffect(() => {
    if (isWebView) redirectFromWebView();
  }, [isWebView]);

  return (
    <Fragment>
      <AppRouter />
    </Fragment>
  );
};

export default App;
