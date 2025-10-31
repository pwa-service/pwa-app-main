import { Fragment } from "react";
import AppRouter from "./components/AppRouter";
import GlobalRedirect from "./components/GlobalRedirect";

const App = () => {
  console.log("current URL: ", window.location.href);

  return (
    <Fragment>
      <GlobalRedirect />
      <AppRouter />
    </Fragment>
  );
};

export default App;
