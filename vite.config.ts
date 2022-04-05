import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { r } from "./scripts/utils";
import { chromeExtension } from "vite-plugin-chrome-extension";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@components": `${r("src/components")}`,
      "@constants": `${r("src/constants")}`,
      "@utils": `${r("src/utils")}`,
      "@provider": `${r("src/provider")}`,
      "@hooks": `${r("src/hooks")}`,
    },
  },
  build: {
    rollupOptions: {
      input: `${r("manifest.json")}`,
    },
  },
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [r(process.cwd(), "src/icons")],
      symbolId: "icon-[name]",
    }),
    react(),
    chromeExtension(),
  ],
});
