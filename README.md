# create-npm-package

一个用于快速搭建 npm 包的工程模板，内置 TypeScript、打包、测试、提交规范与发布流程等最佳实践，开箱即用。

## 这是什么

- 面向 npm 包开发的模板仓库，默认使用 Bun 作为开发与脚本运行环境。
- 提供完整的 ESM/CJS 导出与类型声明产物，适合直接发布或二次扩展。
- 内置 CI、Changesets、Lint/格式化、覆盖率校验等质量门槛。

## 核心特性

- TypeScript 严格模式与现代配置（`strict`、`noUncheckedIndexedAccess` 等）
- tsdown 打包输出 ESM/CJS、`.d.ts` 与 Source Map
- 完整导出映射（`package.json#exports`、`main`、`module`、`types`）
- Biome 提供 Lint/格式化与 CI 集成
- Vitest + V8 覆盖率，默认覆盖率阈值 ≥ 90%
- Changesets 版本管理与发布流程，支持自定义提交消息
- Husky + lint-staged + Commitlint 约定式提交校验
- Volta 固定 Node 版本，确保本地与 CI 环境一致
- `attw`（AreTheTypesWrong）导出与类型正确性校验
- secretlint 检查敏感信息泄露

## 环境要求

- Node >= 22（Volta 固定为 22.19.0）
- Bun >= 1.0.0
- 包管理器：推荐使用 Bun；如需改用 npm/yarn/pnpm，请保持锁文件与依赖一致
- node_modules 布局：Bun 使用 `linker = "isolated"`

## 快速开始

```bash
bun install
```

本地演示入口：

```bash
bun run src/index.ts
```

示例会调用 `src/utils/index.ts` 中的 `add` 方法并输出计算结果。

## 作为库使用

当你将产物发布到 npm 后，可按如下方式引入：

ESM：

```ts
import { add, type DemoType } from "create-npm-package";

const result = add(2, 3);
console.log(result);

const user: DemoType = { name: "Tom" };
```

CJS：

```js
const { add } = require("create-npm-package");

console.log(add(2, 3));
```

如果需要按模块导入：

```ts
import { createGreeter } from "create-npm-package/core";
import { add } from "create-npm-package/utils";
```

## 常用脚本

- 开发与质量
  - `bun run lint`：Biome 检查
  - `bun run lint:fix`：Biome 自动修复
  - `bun run typecheck`：TypeScript 类型检查
  - `bun run test`：Vitest 全量测试
  - `bun run test:watch`：Vitest 监听模式
  - `bun run test:coverage`：覆盖率报告
- 构建与校验
  - `bun run build`：使用 tsdown 打包（CJS/ESM + d.ts + sourcemap → `dist/`）
  - `bun run check:exports`：使用 `attw` 校验导出与类型
- 发布（Changesets）
  - `bun run release:version`：根据变更集生成版本号与 `CHANGELOG`
  - `bun run release:publish`：发布到当前 registry（需已登录）
- 其他
  - `bun run ci`：本地串跑 CI（lint → typecheck → test → build → check:exports）
  - `bun run build:changeset`：编译 `scripts/changeset.commit.ts` 为 `.changeset/changeset.commit.cjs`

> 说明：`prepublishOnly` 会在发布前自动执行 `bun run ci`，确保发布质量。

## 目录结构

```text
.
├─ src/
│  ├─ index.ts          # 库入口与对外导出示例
│  ├─ core/             # 核心模块示例
│  └─ utils/            # 工具模块示例
├─ tests/               # Vitest 用例
├─ scripts/             # Changesets 辅助脚本
├─ dist/                # 构建产物（build 后生成）
├─ tsdown.config.ts     # 打包配置（含 changeset 构建目标）
├─ vitest.config.ts     # 测试配置（V8 覆盖率）
├─ bunfig.toml          # Bun 配置（覆盖率阈值、registry）
├─ tsconfig.json        # TypeScript 配置（严格模式等）
├─ package.json         # 脚本、导出映射、引擎/工具声明等
└─ CHANGELOG.md         # 版本变更记录（由 Changesets 生成）
```

## 构建与产物说明

- 入口：`src/index.ts`
- 产物目录：`dist/`
- 产物类型：
  - `index.js`（ESM）
  - `index.cjs`（CJS）
  - `index.d.ts` / `index.d.cts`（类型声明）
  - `*.map`（Source Map）
- 导出映射：见 `package.json#exports`，并提供 `main/module/types` 字段方便生态工具识别

## 版本与发布（Changesets）

1. 添加变更集：

   ```bash
   bunx changeset add
   ```

2. 生成版本号与变更日志：

   ```bash
   bun run release:version
   ```

3. 发布到 npm（或当前 registry）：

   ```bash
   bun run release:publish
   ```

可选：若需自定义 Changesets 的提交消息格式，可执行：

```bash
bun run build:changeset
```

该命令会将 `scripts/changeset.commit.ts` 编译为 `.changeset/changeset.commit.cjs`，供 Changesets 读取使用。

## 贡献指南

请阅读 [Repository Guidelines](AGENTS.md)，其中包含目录结构说明、开发流程与提交流程的具体约定。

## 常见问题

- Node 版本不满足？
  - 请将 Node 升级到 >= 22，或使用 Volta/`nvm` 切换到合适版本。
- `attw` 校验失败？
  - 说明导出或类型存在潜在问题，请根据错误信息调整导出或类型定义，然后重新执行 `bun run build && bun run check:exports`。

## 许可证

MIT © PerryFinn
