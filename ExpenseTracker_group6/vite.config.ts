import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import Inspect from "vite-plugin-inspect"; // Example dev-only plugin

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // ...(mode === 'development' ? [Inspect()] : []) // Uncomment if you add a plugin
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
