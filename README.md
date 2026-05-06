# perryfinn-monorepo

一个基于 Bun Workspaces 的 npm 多包模板仓库，包含可独立发布的 `utils`、`cli` 两个包。它用于演示 TypeScript 库包、CLI 包、Changesets 发布、GitHub Actions CI 和基础质量检查的组合方式。

## 包结构

- `@perryfinn/utils`：工具函数模块
- `@perryfinn/cli`：命令行工具（`perryfinn`）

目录：

```text
.
├─ packages/
│  ├─ utils/
│  │  ├─ src/
│  │  ├─ tests/
│  │  └─ package.json
│  └─ cli/
│     ├─ src/
│     ├─ tests/
│     └─ package.json
├─ .changeset/
├─ .github/workflows/
├─ scripts/
├─ bunfig.toml
├─ package.json
└─ tsconfig.base.json
```

## 环境要求

- Node >= 24.15.0
- Bun >= 1.0.0（当前锁文件由 Bun 1.3.13 生成）

## 快速开始

```bash
bun install
bun run ci
```

## 常用命令（根目录）

- `bun run lint`：在全部 workspace 执行 lint
- `bun run lint:fix`：在全部 workspace 自动修复 lint
- `bun run check:type`：在全部 workspace 执行类型检查
- `bun run test`：在全部 workspace 执行测试
- `bun run test:coverage`：在全部 workspace 生成覆盖率
- `bun run build`：在全部 workspace 打包
- `bun run check:exports`：校验库包导出和 CLI bin 可执行性
- `bun run ci`：完整本地 CI（lint → check:type → test:coverage → build → check:exports）

导出检查由共享脚本驱动：

- `scripts/check-exports.ts`：用 ATTW 校验库包导出和类型声明。
- `scripts/check-cli-bin.ts`：打包 CLI，解压 tarball，并验证 bin shebang、执行权限和基本输出。

按包执行示例：

```bash
bun run --filter @perryfinn/utils test
bun run --filter @perryfinn/cli test
```

## 发布流程（Changesets）

发布包会包含 `dist`、`README.md` 和 `LICENSE.txt`。因为 `dist` 不提交到 Git，发布前必须先构建。

1. 生成变更集

```bash
bunx changeset add
```

2. 计算版本并更新 changelog

```bash
bun run release:version
```

3. 发布所有需要发布的 workspace 包

```bash
bun run build
bun run release:publish
```

合入 `main` 后，GitHub Actions 会在 CI 成功后运行 Changesets workflow：有待发布 changeset 时创建 release PR；release PR 合入后通过 `NPM_TOKEN` 发布到 npm registry。

## 许可证

MIT © PerryFinn
