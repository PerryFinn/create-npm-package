import { access, mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { $ } from "bun";

type PackageJson = {
  name?: string;
  main?: string;
  bin?: string | Record<string, string>;
};

type BinEntry = {
  name: string;
  path: string;
};

// 允许脚本在包目录内直接运行，也允许从仓库根目录传入目标包路径。
const parsePackageDir = (args: string[]): string => {
  const [packageDir = process.cwd()] = args;
  return resolve(packageDir);
};

// 只读取后续检查需要的 package.json 字段，避免把脚本耦合到完整 manifest 结构。
const readPackageJson = async (packageDir: string): Promise<PackageJson> => {
  const packageJsonPath = join(packageDir, "package.json");
  await access(packageJsonPath);
  return JSON.parse(await readFile(packageJsonPath, "utf8")) as PackageJson;
};

// npm 允许 bin 写成字符串或对象；这里统一展开为可逐项检查的数组。
const getBinEntries = (packageJson: PackageJson): BinEntry[] => {
  if (typeof packageJson.bin === "string") {
    return [{ name: packageJson.name ?? "cli", path: packageJson.bin }];
  }

  return Object.entries(packageJson.bin ?? {}).map(([name, path]) => ({ name, path }));
};

// 检查最终发布物，而不是源码目录，确保 package.json 的 files 配置不会漏掉 bin 产物。
const getPackedTarballPath = async (packageDir: string, tempDir: string): Promise<string> => {
  const packOutput = await $`bun pm pack --quiet --destination ${tempDir}`.cwd(packageDir).text();
  const tarballPath = packOutput
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!tarballPath) {
    throw new Error("bun pm pack did not return a tarball path");
  }

  return tarballPath;
};

// 用 Node 执行解压后的 bin，避免 Bun 运行时掩盖 Node CLI 的兼容性问题。
const runNode = async (binPath: string, args: string[], expectedOutput: string): Promise<void> => {
  const subprocess = Bun.spawn(["node", binPath, ...args], {
    stderr: "pipe",
    stdout: "pipe"
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(subprocess.stdout).text(),
    new Response(subprocess.stderr).text(),
    subprocess.exited
  ]);

  if (exitCode !== 0) {
    throw new Error(`node ${binPath} ${args.join(" ")} exited with ${exitCode}: ${stderr}`);
  }

  if (!stdout.includes(expectedOutput)) {
    throw new Error(`Expected CLI output to include "${expectedOutput}", got "${stdout.trim()}"`);
  }
};

// 同时检查 npm bin 最容易漏掉的三件事：文件权限、shebang 和基础命令输出。
const checkBinEntry = async (extractDir: string, entry: BinEntry): Promise<void> => {
  const binPath = join(extractDir, "package", entry.path);
  const [mode, source] = await Promise.all([stat(binPath), readFile(binPath, "utf8")]);

  if ((mode.mode & 0o111) === 0) {
    throw new Error(`bin "${entry.name}" is not executable: ${entry.path}`);
  }

  if (!source.startsWith("#!/usr/bin/env node")) {
    throw new Error(`bin "${entry.name}" is missing the Node shebang: ${entry.path}`);
  }

  await runNode(binPath, [], "perryfinn cli ready");
  await runNode(binPath, ["--help"], "Usage: perryfinn [options]");
};

const main = async (): Promise<void> => {
  const packageDir = parsePackageDir(process.argv.slice(2));
  const packageJson = await readPackageJson(packageDir);
  const binEntries = getBinEntries(packageJson);

  if (binEntries.length === 0) {
    throw new Error("package.json does not define any bin entries");
  }

  const tempDir = await mkdtemp(join(tmpdir(), "perryfinn-cli-bin-"));
  const extractDir = join(tempDir, "extract");

  try {
    // 先打包再解压，验证路径与 npm 用户实际安装后的包结构一致。
    const tarballPath = await getPackedTarballPath(packageDir, tempDir);
    await mkdir(extractDir, { recursive: true });
    await $`tar -xzf ${tarballPath} -C ${extractDir}`;
    await Promise.all(binEntries.map((entry) => checkBinEntry(extractDir, entry)));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

await main();
