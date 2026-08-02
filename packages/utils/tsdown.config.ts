import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  clean: true,
  minify: false,
  target: "es2020",
  outExtensions: ({ format }) => ({
    js: format === "cjs" ? ".cjs" : ".js",
    dts: format === "cjs" ? ".d.cts" : ".d.ts"
  })
});
