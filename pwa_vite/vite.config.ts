import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import preload from "vite-plugin-preload";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    base: "./",

    build: {
      target: "esnext",
      brotliSize: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("react")) return "react";
            if (id.includes("node_modules")) return "vendor";
          },
        },
      },
    },

    plugins: [
      react(),

      preload(),
      tailwindcss(),

      viteCompression({ algorithm: "gzip" }),
      viteCompression({ algorithm: "brotliCompress" }),

      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        scope: "/",

        devOptions: {
          enabled: true,
        },

        workbox: {
          runtimeCaching: [
            {
              urlPattern: /\.(png|webp|jpg|jpeg|avif)$/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "images",
                expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
              },
            },
            {
              urlPattern: /\.(js|css)$/i,
              handler: "StaleWhileRevalidate",
              options: { cacheName: "static-resources" },
            },
            {
              urlPattern: /\/api\/.*$/,
              handler: "NetworkFirst",
              options: { cacheName: "api-cache", networkTimeoutSeconds: 5 },
            },
          ],
        },

        manifest: {
          short_name: "ICE FISHING",
          name: "ICE FISHING",
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
              src: "./app_icon.webp",
              type: "image/webp",
              sizes: "512x512",
            },
          ],
        },
      }),
    ],
  };
});
