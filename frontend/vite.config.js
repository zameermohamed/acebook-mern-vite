import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: "jsdom",
//     coverage: {
//       provider: "v8", // Make sure this is set correctly
//       thresholds: {
//         global: {
//           branches: 60,
//           functions: 60,
//           lines: 60,
//           statements: 60,
//         },
//       },
//     },
//   },
// });

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
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});
