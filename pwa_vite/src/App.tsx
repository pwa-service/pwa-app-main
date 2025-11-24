import { useEffect, Fragment } from "react";
import { useIsWebView } from "./hooks/useIsWebView";

import { redirectFromWebView } from "./helpers/redirectFromWebView";

import AppRouter from "./components/AppRouter";

const App = () => {
  const { isWebView } = useIsWebView();

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
