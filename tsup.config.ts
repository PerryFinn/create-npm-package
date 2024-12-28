import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: {
    index: "src/index.ts"
    // 重新生成 changeset.commit.cjs 文件时需要
    // "changeset.commit": "./scripts/changeset.commit.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  clean: true
});
