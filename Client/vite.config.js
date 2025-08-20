import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    minify: "terser",
    target: "esnext",
    terserOptions: {
      compress: {
        defaults: true,
        drop_console: true,
        hoist_vars: false,
        hoist_funs: false,
        pure_getters: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      external: [
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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label'],
          'vendor-store': ['zustand'],
          'vendor-socket': ['socket.io-client'],
          'vendor-animation': ['framer-motion'],
          'vendor-monaco': ['monaco-editor'],
          'vendor-axios': ['axios']
        }
      }
    }
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
