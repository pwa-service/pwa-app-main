import { Fragment, useEffect } from "react";
import { useUserAgent } from "./hooks/useUserAgent";
import { loadPWAData } from "./helpers/loadPWAData";
import { REDIRECT_URL_KEY } from "./constants/storage";

import AppRouter from "./components/AppRouter";
import GlobalRedirect from "./components/GlobalRedirect";

loadPWAData();

const App = () => {
  const { isPWA } = useUserAgent();

  useEffect(() => {
    if (isPWA) {
      const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY)!;
      window.location.replace(redirectUrl);
    }
  }, [isPWA]);

  return (
    <Fragment>
      <GlobalRedirect />
      <AppRouter />
    </Fragment>
  );
};

export default App;
