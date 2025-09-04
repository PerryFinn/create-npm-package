import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts"
    },
    format: ["cjs", "esm", "iife"],
    dts: true,
    sourcemap: true,
    outDir: "dist",
    clean: true,
    minify: false
  },
  {
    entry: {
      // 重新生成 changeset.commit.cjs 文件时需要
      "changeset.commit": "./scripts/changeset.commit.ts"
    },
    format: ["cjs"],
    sourcemap: true,
    outDir: ".changeset",
    clean: false
  }
]);
