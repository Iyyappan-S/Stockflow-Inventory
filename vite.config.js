import { defineConfig } from "vite";

export default defineConfig({
  root: "client",
  server: {
    allowedHosts: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
