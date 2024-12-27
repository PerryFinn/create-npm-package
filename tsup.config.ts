import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts", "src/demo.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  clean: true
});
