import { useEffect } from "react";
import { useIsWebView } from "./hooks/useIsWebView";
import { useSmartLook } from "./hooks/useSmartLook";

import { redirectFromWebView } from "./helpers/redirectFromWebView";

import AppRouter from "./components/AppRouter";

const App = () => {
  const { isWebView } = useIsWebView();
  useSmartLook();

  useEffect(() => {
    if (isWebView) redirectFromWebView();
  }, [isWebView]);

  return <AppRouter />;
};

export default App;
