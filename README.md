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

## 开发环境

- Node.js `^24.15.0` 或 `>=26.0.0`，CI 从 `.node-version` 读取固定版本。
- Bun `1.4.4`，CI 从根 `package.json` 的 `packageManager` 读取版本。

## 从模板创建

在 GitHub 上点 **Use this template** 创建并克隆新仓库。从仓库根目录运行以下命令，把 `@acme` 换成自己的 npm 用户或组织 scope。

```bash
bun scripts/init-template.ts --scope @acme
bun install
bun run ci
```

例如，仓库 `acme/my-tool` 用 `@acme` 初始化后，库名为 `@acme/my-tool`，CLI 包名为 `@acme/my-tool-cli`，命令为 `my-tool`。脚本会更新包的元数据、文档和 CLI 示例，清理模板自带的发版历史。首次安装会更新 `bun.lock`，把它和初始化改动一起提交。

脚本要求新仓库的 `origin` 指向 GitHub，工作区干净，两个示例包仍使用模板原名。初始化之后，如果只需要一个包，可以删除 `packages/cli` 或 `packages/utils`。删除库时，同时移除 CLI 的 `package.json` 中对应的 `workspace:*` 依赖。删减后再运行 `bun install` 和 `bun run ci`。

## 运行模板示例

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

### 启用自动发布

新仓库推送到 `main` 时默认执行 CI，Changesets 的发布任务会跳过。准备好发布时，按以下顺序配置新仓库。

1. 确认 npm 包名归属和打包内容，并运行 `bun run ci`。
2. 在 GitHub 的 **Settings → Secrets and variables → Actions** 中添加有对应包发布权限的 `NPM_TOKEN` secret。在 **Settings → Actions → General** 中允许 Actions 创建 PR。
3. 在 **Settings → Secrets and variables → Actions → Variables** 添加 `NPM_RELEASE_REPOSITORY`，值为当前仓库的 `owner/repo`，例如 `acme/my-tool`。原模板仓库也通过同一变量启用自己的自动发布。

启用后，`main` 的推送通过 CI 就会运行 Changesets。有待处理的变更集时，它会创建或更新 release PR。没有待处理的变更集时，它会尝试发布 npm 上尚未存在的包版本。

### 手动发布

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

### Release PR 处理约定

- Release PR 由 GitHub Actions 中的 Changesets workflow 自动创建，通常从 `changeset-release/main` 合入 `main`。
- 按当前仓库的分支保护规则完成评审。合并 release PR 前，确认它包含这次发布需要的版本变更。
- 原模板仓库通过 `develop` 向 `main` 汇入变更，并要求至少一个有写权限的账号批准 PR。先把本次发布需要的提交合入 `main`，再让 Changesets 更新 release PR。

## 许可证

MIT © PerryFinn
