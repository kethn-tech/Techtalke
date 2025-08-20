import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'classic' }]
        ]
      }
    })
  ],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    minify: 'esbuild',
    target: 'esnext',
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('monaco-editor')) {
              return 'monaco';
            }
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            if (id.includes('react') || id.includes('zustand') || id.includes('socket.io-client')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'monaco-editor']
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  }
});
