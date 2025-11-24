import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router";
import TrackerContextProvider from "./components/TrackerContextProvider.tsx";

import { initServiceWorker } from "./helpers/initServiceWorker.ts";
import { redirectOnLaunch } from "./helpers/redirectOnLaunch.ts";

import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <TrackerContextProvider>
        <App />
      </TrackerContextProvider>
    </BrowserRouter>
  </StrictMode>
);

initServiceWorker();
redirectOnLaunch();
