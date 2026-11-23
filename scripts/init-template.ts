import { execFileSync } from "node:child_process";
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

const TEMPLATE_REPOSITORY = "PerryFinn/create-npm-package";
const TEMPLATE_ROOT = "perryfinn-monorepo";
const TEMPLATE_LIBRARY = "@perryfinn/utils";
const TEMPLATE_CLI = "@perryfinn/cli";
const TEMPLATE_BIN = "perryfinn";
const INITIAL_VERSION = "0.1.0";
const USAGE = "用法：bun scripts/init-template.ts --scope @acme";
const projectDir = resolve(import.meta.dir, "..");

type PackageManifest = {
  name: string;
  version: string;
  description: string;
  keywords: string[];
  homepage: string;
  bugs: { url: string };
  repository: { url: string; directory?: string };
  author?: string;
  bin?: Record<string, string>;
  dependencies?: Record<string, string>;
};

type Edit = {
  path: string;
  original: string;
  updated: string | null;
};

const git = (...args: string[]): string =>
  execFileSync("git", args, { cwd: projectDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const read = (path: string): Promise<string> => readFile(join(projectDir, path), "utf8");

const getRepository = (): string => {
  if (git("rev-parse", "--show-prefix")) {
    throw new Error("请先克隆用模板创建的新 GitHub 仓库。");
  }

  const originPattern =
    /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([\w-]+\/[\w.-]+?)(?:\.git)?\/?$/i;
  const repository = git("config", "--get", "remote.origin.url").match(originPattern)?.[1];
  if (!repository) {
    throw new Error("请将 origin 指向新仓库的 GitHub HTTPS 或 SSH 地址。");
  }
  if (repository.toLowerCase() === TEMPLATE_REPOSITORY.toLowerCase()) {
    throw new Error("请通过 GitHub Use this template 创建并克隆新仓库后再初始化。");
  }
  if (git("status", "--porcelain")) {
    throw new Error("初始化需要干净的工作区，请先处理现有改动。");
  }

  return repository;
};

const applyEdits = async (edits: Edit[]): Promise<void> => {
  const attempted: Edit[] = [];
  try {
    for (const edit of edits) {
      attempted.push(edit);
      const path = join(projectDir, edit.path);
      if (edit.updated === null) {
        await unlink(path);
      } else {
        await writeFile(path, edit.updated);
      }
    }
  } catch (error) {
    const restored = await Promise.allSettled(
      attempted.map(({ path, original }) => writeFile(join(projectDir, path), original))
    );
    const failed = attempted.filter((_, index) => restored[index]?.status === "rejected");
    if (failed.length > 0) {
      throw new Error(`初始化中断，请用 git diff 检查这些文件：${failed.map(({ path }) => path).join(", ")}`, {
        cause: error
      });
    }
    throw error;
  }
};

const main = async (): Promise<void> => {
  const {
    values: { scope, help }
  } = parseArgs({
    options: { scope: { type: "string" }, help: { type: "boolean", short: "h" } }
  });
  if (help) {
    console.log(USAGE);
    return;
  }
  if (!scope || !/^@[a-z0-9][a-z0-9._-]*$/.test(scope)) {
    throw new Error(`请提供有效的 npm scope，例如 @acme。\n${USAGE}`);
  }

  const repository = getRepository();
  const projectName = repository.slice(repository.indexOf("/") + 1).toLowerCase();
  const libraryName = `${scope}/${projectName}`;
  const cliName = `${libraryName}-cli`;
  if (
    !/^[a-z0-9][a-z0-9._-]*$/.test(projectName) ||
    cliName.length > 214 ||
    libraryName === TEMPLATE_LIBRARY ||
    libraryName === TEMPLATE_CLI
  ) {
    throw new Error("请使用能生成有效且不同于示例包名的 GitHub 仓库名和 npm scope。");
  }

  const repositoryUrl = `https://github.com/${repository}`;
  const manifests = [
    { path: "package.json", oldName: TEMPLATE_ROOT, name: projectName },
    { path: "packages/utils/package.json", oldName: TEMPLATE_LIBRARY, name: libraryName },
    { path: "packages/cli/package.json", oldName: TEMPLATE_CLI, name: cliName }
  ];
  const edits: Edit[] = [];

  for (const { path, oldName, name } of manifests) {
    const original = await read(path);
    const manifest = JSON.parse(original) as PackageManifest;
    if (manifest.name !== oldName) {
      throw new Error(`${path} 已使用其他包名。请在刚创建的模板副本中运行初始化脚本。`);
    }

    manifest.name = name;
    manifest.version = INITIAL_VERSION;
    manifest.description = manifest.description.replace("PerryFinn", projectName);
    manifest.keywords = manifest.keywords.map((keyword) => (keyword === TEMPLATE_BIN ? projectName : keyword));
    const directory = manifest.repository.directory;
    manifest.homepage = `${repositoryUrl}${directory ? `/tree/main/${directory}` : ""}#readme`;
    manifest.bugs.url = `${repositoryUrl}/issues`;
    manifest.repository.url = `git+${repositoryUrl}.git`;
    delete manifest.author;

    if (oldName === TEMPLATE_CLI) {
      const bins = manifest.bin;
      const binPath = bins?.[TEMPLATE_BIN];
      const dependencies = manifest.dependencies;
      if (!bins || !binPath || !dependencies || dependencies[TEMPLATE_LIBRARY] !== "workspace:*") {
        throw new Error("CLI 的示例 bin 或 workspace 依赖已修改，请检查其 package.json。");
      }
      delete bins[TEMPLATE_BIN];
      bins[projectName] = binPath;
      dependencies[libraryName] = dependencies[TEMPLATE_LIBRARY];
      delete dependencies[TEMPLATE_LIBRARY];
    }

    edits.push({ path, original, updated: `${JSON.stringify(manifest, null, 2)}\n` });
  }

  const replacements: Record<string, string> = {
    [TEMPLATE_ROOT]: projectName,
    [TEMPLATE_LIBRARY]: libraryName,
    [TEMPLATE_CLI]: cliName,
    [TEMPLATE_BIN]: projectName,
    "PerryFinn monorepo": projectName
  };
  const sampleNames = /@perryfinn\/(?:utils|cli)|perryfinn-monorepo|PerryFinn monorepo|\bperryfinn\b/g;
  for (const path of [
    "README.md",
    "packages/utils/README.md",
    "packages/cli/README.md",
    "packages/cli/src/run.ts",
    "packages/cli/tests/index.test.ts"
  ]) {
    const original = await read(path);
    const updated = original.replace(sampleNames, (match) => replacements[match] ?? match);
    edits.push({ path, original, updated });
  }

  for (const { path, oldName, name } of manifests) {
    const changelogPath = join(dirname(path), "CHANGELOG.md");
    try {
      const original = await read(changelogPath);
      edits.push({ path: changelogPath, original, updated: `# ${name}\n` });
    } catch (error) {
      if (oldName === TEMPLATE_ROOT || (error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  for (const entry of await readdir(join(projectDir, ".changeset"), { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === "README.md" || !entry.name.endsWith(".md")) {
      continue;
    }
    const path = `.changeset/${entry.name}`;
    const original = await read(path);
    const releases = original
      .match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
      ?.trim()
      .split(/\r?\n/);
    const sampleRelease = /^["']?@perryfinn\/(?:utils|cli)["']?:\s*(?:patch|minor|major)$/;
    if (releases?.every((release) => sampleRelease.test(release.trim()))) {
      edits.push({ path, original, updated: null });
    }
  }

  await applyEdits(edits);
  console.log(`已初始化 ${repository}，包名为 ${libraryName} 和 ${cliName}，CLI 命令为 ${projectName}。`);
  console.log("接下来运行 bun install 更新锁文件，再运行 bun run ci。");
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
