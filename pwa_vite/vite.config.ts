import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    base: "./",
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "service-worker.js",
        injectRegister: false,
        scope: "/",

        manifest: {
          short_name: "Kino Casino",
          name: "Kino Casino",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",

          protocol_handlers: [
            {
              protocol: "web+myapp",
              url: "/?data=%s",
            },
          ],

          icons: [
            {
              src: "./favicon.ico",
              type: "image/x-icon",
              sizes: "256x256",
            },

            {
              src: "./app_icon.webp",
              type: "image/webp",
              sizes: "512x512",
            },
          ],

          // screenshots: [
          //   {
          //     src: "./screenshots",
          //     form_factor: "narrow",
          //     sizes: "",
          //     type: "image/png",
          //     label: "",
          //   },
          // ],
        },
      }),
    ],
  };
});
