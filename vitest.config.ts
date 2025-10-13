import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      all: true, // 显式开启：对 include 命中的所有文件统计覆盖率
      include: ["src/**"], // 只统计 src 下的源码
      exclude: [
        "src/**/__tests__/**",
        "src/**/*.{test,spec}.{ts,tsx,js,jsx}",
        "**/*.d.ts",
        "dist/**",
        "**/scripts/**",
        "**/types.ts"
      ]
    }
  }
});
