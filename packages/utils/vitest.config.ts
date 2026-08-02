import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/**"],
      exclude: [
        "src/**/__tests__/**",
        "src/**/*.{test,spec}.{ts,tsx,js,jsx}",
        "**/*.d.ts",
        "dist/**",
        "**/scripts/**",
        "**/types.ts"
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
});
