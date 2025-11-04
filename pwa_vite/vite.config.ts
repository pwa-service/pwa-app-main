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
          short_name: "PWA Skeleton",
          name: "React PWA Skeleton",
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
              sizes: "64x64 32x32 24x24 16x16",
            },

            {
              src: "./app_icon_256.png",
              type: "image/png",
              sizes: "256x256",
            },

            {
              src: "./app_icon_512.png",
              type: "image/png",
              sizes: "512x512",
            },

            {
              purpose: "maskable",
              sizes: "512x512",
              src: "./app_icon_512_maskable.png",
              type: "image/png",
            },

            {
              purpose: "any",
              sizes: "512x512",
              src: "./app_icon_512_rounded.png",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  };
});
