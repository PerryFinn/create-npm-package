import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: {
    index: "src/index.ts",
    "changeset.commit": "./scripts/demo.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  clean: true
});
