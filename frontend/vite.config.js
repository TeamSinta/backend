import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        ref: true,
      },
    }),
    eslint(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // components: path.resolve(__dirname, "src/components"),
      // assets: path.resolve(__dirname, "src/assets"),
      // styles: path.resolve(__dirname, "src/styles"),
      // utils: path.resolve(__dirname, "src/utils"),
    },
  },
  server: {
    open: true,
    port: 3001,
    host: true,
  },
  build: {
    outDir: "./build",
  },
});
