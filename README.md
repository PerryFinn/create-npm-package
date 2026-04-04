# perryfinn-monorepo

一个基于 Bun Workspaces 的多包模板仓库，包含独立发布的 `utils`、`cli` 两个包。

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

- Node >= 22
- Bun >= 1.0.0

## 快速开始

```bash
bun install
```

## 常用命令（根目录）

- `bun run lint`：在全部 workspace 执行 lint
- `bun run lint:fix`：在全部 workspace 自动修复 lint
- `bun run check:type`：在全部 workspace 执行类型检查
- `bun run test`：在全部 workspace 执行测试
- `bun run test:coverage`：在全部 workspace 生成覆盖率
- `bun run build`：在全部 workspace 打包
- `bun run check:exports`：仅校验 `@perryfinn/utils` 导出
- `bun run ci`：完整本地 CI（lint → check:type → test → build → check:exports）

导出检查由共享脚本 `scripts/check-exports.ts` 驱动，方便后续包复用。

按包执行示例：

```bash
bun run --filter @perryfinn/utils test
bun run --filter @perryfinn/cli test
```

## 发布流程（Changesets）

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
bun run release:publish
```

## 许可证

MIT © PerryFinn
