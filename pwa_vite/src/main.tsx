import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import type { BeforeInstallPromptEvent } from "./types/global";
import { redirectOnLaunch } from "./helpers/redirectOnLaunch.ts";

import { EventTrackerContextProvider } from "./modules/event-tracking";
import { PWAInstallContextProvider } from "./modules/pwa-installation";

import App from "./App.tsx";
import "./index.css";

window.deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  window.deferredPrompt = event as BeforeInstallPromptEvent;
  const readyEvent = new CustomEvent("pwa-prompt-ready");

  window.dispatchEvent(readyEvent);
  console.log("PWA Install Event captured globally");
});

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <EventTrackerContextProvider>
          <PWAInstallContextProvider>
            <App />
          </PWAInstallContextProvider>
        </EventTrackerContextProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

redirectOnLaunch();
