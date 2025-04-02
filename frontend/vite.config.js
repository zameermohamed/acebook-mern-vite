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
        // Note: 'thresholds' instead of 'threshold'
        branches: 80,
        functions: 65,
        lines: 75,
        statements: 75,
      },
    },
  },
});
