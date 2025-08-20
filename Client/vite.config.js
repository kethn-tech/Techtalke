import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [
        // Exclude Node.js modules from browser bundle
        "fs",
        "path",
        "http",
        "https",
        "crypto",
        "stream",
        "util",
        "url",
        "querystring",
      ],
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("monaco-editor")) {
              return "monaco";
            }
            if (id.includes("react")) {
              return "react-vendor";
            }
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            return "vendor";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Ensure these are defined for browser
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["@emotion/is-prop-valid"],
  },
});
