import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router";
import TrackerProvider from "./context/tracker/TrackerContextProvider.tsx";
import PWAInstallProvider from "./context/pwa-install/PWAInstallProvider.tsx";
import App from "./App.tsx";

import "./index.css";

import { initServiceWorkerForRedirect } from "./helpers/initServiceWorkerForRedirect.ts";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <TrackerProvider>
        <PWAInstallProvider>
          <App />
        </PWAInstallProvider>
      </TrackerProvider>
    </BrowserRouter>
  </StrictMode>
);

initServiceWorkerForRedirect();
