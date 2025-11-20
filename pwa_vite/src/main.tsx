import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router";
import TrackerProvider from "./context/tracker/TrackerContextProvider.tsx";
import App from "./App.tsx";

import "./index.css";

import { initServiceWorker } from "./helpers/initServiceWorker.ts";
import { redirectOnLaunch } from "./helpers/redirectOnLaunch.ts";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <TrackerProvider>
        <App />
      </TrackerProvider>
    </BrowserRouter>
  </StrictMode>
);

initServiceWorker();
redirectOnLaunch();
