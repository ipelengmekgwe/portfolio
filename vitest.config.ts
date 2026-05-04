import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Order matters — Vite matches in array order, so the more-specific
    // `@/content/*` alias must come BEFORE the catch-all `@/*` or the latter
    // will swallow content imports and try to resolve them under src/.
    alias: [
      {
        find: /^@\/content\/(.*)$/,
        replacement: `${path.resolve(__dirname, "./content")}/$1`,
      },
      { find: /^@\/(.*)$/, replacement: `${path.resolve(__dirname, "./src")}/$1` },
    ],
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["**/*.test.*", "**/*.config.*", "**/node_modules/**"],
    },
  },
});
