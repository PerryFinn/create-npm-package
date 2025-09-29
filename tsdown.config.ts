import { defineConfig, type Options } from "tsdown";

type BuildConfig = Omit<Options, "config" | "filter"> | null;

const commonConfig: Options = {
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  clean: true,
  minify: false,
  target: "es2020"
};

/** 生成 changeset 相关的构建配置 */
const genChangesetConfig = (): BuildConfig => {
  const enableChangesetBuild = process.env.ENABLE_CHANGESET_BUILD === "true";
  if (!enableChangesetBuild) return null;

  return {
    ...commonConfig,
    entry: {
      // 重新生成 changeset.commit.cjs 文件时需要
      "changeset.commit": "./scripts/changeset.commit.ts"
    },
    format: ["cjs"],
    outDir: ".changeset",
    clean: false,
    target: "node14",
    dts: false
    // 把 js 和 cjs 格式的 dts 扩展名都固定成 .d.ts（防止产出 .d.cts和 .d.ts 两种类型文件）
    // outExtensions: ({ format }) => ({
    //   js: format === "cjs" ? ".cjs" : ".js",
    //   dts: ".d.ts"
    // })
  };
};

/** tool-box-kit/utils 相关的构建配置 */
export const genUtilsConfig = (): BuildConfig => {
  return {
    ...commonConfig,
    entry: {
      utils: "src/utils/index.ts"
    }
  };
};

/** tool-box-kit/core 相关的构建配置 */
export const genCoreConfig = (): BuildConfig => {
  return {
    ...commonConfig,
    entry: {
      core: "src/core/index.ts"
    }
  };
};

/** 库入口相关的构建配置 */
export const genIndexConfig = (): BuildConfig => {
  return {
    ...commonConfig,
    entry: {
      index: "src/index.ts"
    }
  };
};

export default defineConfig(
  [genUtilsConfig(), genCoreConfig(), genIndexConfig(), genChangesetConfig()].filter(Boolean) as Options[]
);
