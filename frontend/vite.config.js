import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        branches: 80,
        functions: 65,
        lines: 80,
        statements: 80,
      },
    },
    exclude: ["**/src/App.jsx", "**/src/main.jsx", "**/node_modules/**"],
  },
});
