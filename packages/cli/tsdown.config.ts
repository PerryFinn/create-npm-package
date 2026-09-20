import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts"
  },
  format: ["cjs"],
  dts: false,
  sourcemap: true,
  outDir: "dist",
  clean: true,
  minify: false,
  target: "node22",
  banner: {
    js: "#!/usr/bin/env node"
  },
  platform: "node"
});
