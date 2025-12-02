import { useEffect } from "react";
import { useIsWebView } from "./hooks/useIsWebView";
import { useSmartLook } from "./hooks/useSmartLook";

import { redirectFromWebView } from "./helpers/redirectFromWebView";

import AppRouter from "./components/AppRouter";

const App = () => {
  const { isWebView } = useIsWebView();
  useSmartLook();

  useEffect(() => {
    redirectFromWebView(isWebView);
  }, [isWebView]);

  return <AppRouter />;
};

export default App;
