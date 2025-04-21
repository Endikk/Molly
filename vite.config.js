import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // Alias pour ShadCN
    },
  },
});
