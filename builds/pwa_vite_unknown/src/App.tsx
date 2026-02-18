import { useEffect } from "react";
import { useIsWebView } from "./hooks/useIsWebView";

import { redirectFromWebView } from "./helpers/redirectFromWebView";

import AppRouter from "./components/AppRouter";

const App = () => {
  const { isWebView } = useIsWebView();

  useEffect(() => {
    if (isWebView) redirectFromWebView();
  }, [isWebView]);

  return <AppRouter />;
};

export default App;
