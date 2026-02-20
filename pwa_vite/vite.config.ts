import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import preload from "vite-plugin-preload";
import tailwindcss from "@tailwindcss/vite";

import { getPWAData } from "./src/helpers/getPWAData";

import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(async () => {
  const settings = {
    url: "https://domain.com",
    lang: getPWAData("lang") || "en",

    title: getPWAData("name") || "Default Title",
    description: getPWAData("description") || "Default Description",

    themeColor: "#1a1a1a",
    backgroundColor: "#000000",

    icon: "./app_icon.webp",
    screenshot: "./screenshot.webp",
  };

  return {
    base: "./",

    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              if (id.includes("firebase")) return "vendor-firebase";
              if (id.includes("smartlook")) return "vendor-smartlook";
              if (id.includes("react") || id.includes("react-router")) return "vendor-core";

              return "vendor-utils";
            }
          },
        },
      },
    },

    plugins: [
      react(),
      preload(),
      tailwindcss(),

      viteCompression({ algorithm: "gzip", ext: ".gz" }),
      viteCompression({ algorithm: "brotliCompress", ext: ".br" }),

      createHtmlPlugin({
        inject: {
          data: {
            url: settings.url,
            lang: settings.lang,

            title: settings.title,
            description: settings.description,

            favicon: settings.icon,
            ogImage: settings.icon,
            themeColor: settings.themeColor,

            appleIcon: `<link rel="apple-touch-icon" href="${settings.icon}">`,
          },
        },
      }),

      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["app_icon.webp", "screenshot.webp", "robots.txt"],
        scope: "/",

        devOptions: {
          enabled: true,
        },

        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
          cleanupOutdatedCaches: true,

          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
              },
            },

            {
              urlPattern: /\.(?:js|css)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "static-assets",
                expiration: { maxEntries: 60, maxAgeSeconds: 31536000 },
              },
            },

            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "images-cache",
                expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
              },
            },

            {
              urlPattern: /\/api\/v1\/.*/,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-data",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 30, maxAgeSeconds: 3600 },
              },
            },

            {
              urlPattern: /^(https:\/\/.*\.firebaseio\.com|https:\/\/.*\.smartlook\.com)/,
              handler: "NetworkOnly",
            },
          ],
        },

        manifest: {
          name: settings.title,
          short_name: settings.title,
          description: settings.description,

          start_url: "/",
          display: "standalone",
          orientation: "portrait",

          theme_color: settings.themeColor,
          background_color: settings.backgroundColor,

          screenshots: [
            {
              src: settings.screenshot,
              sizes: "1280x720",
              type: "image/webp",
              form_factor: "wide",
              label: settings.title,
            },
          ],

          icons: [
            {
              src: settings.icon,
              type: "image/webp",
              sizes: "512x512",
              purpose: "any maskable",
            },
          ],

          protocol_handlers: [
            {
              protocol: "web+myapp",
              url: "/?data=%s",
            },
          ],
        },
      }),
    ],
  };
});
