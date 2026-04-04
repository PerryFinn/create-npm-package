import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { $ } from "bun";

type CheckExportsOptions = {
  packageDir: string;
  profile: string;
};

// 默认检查当前目录，也允许从仓库根目录显式传入包路径。
const parseArgs = (args: string[]): CheckExportsOptions => {
  let packageDir = process.cwd();
  let profile = "node16";

  for (const arg of args) {
    if (arg.startsWith("--profile=")) {
      profile = arg.slice("--profile=".length);
      continue;
    }

    packageDir = resolve(arg);
  }

  return { packageDir, profile };
};

const getPackedTarballPath = async (packageDir: string, tempDir: string): Promise<string> => {
  const packOutput = await $`bun pm pack --quiet --destination ${tempDir}`.cwd(packageDir).text();
  // `bun pm pack --quiet` 目前会带一个空行，取最后一个非空行作为 tgz 路径。
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

const main = async (): Promise<void> => {
  const { packageDir, profile } = parseArgs(process.argv.slice(2));
  await access(join(packageDir, "package.json"));

  // ATTW 更适合直接检查打包产物，这里先用 Bun 打包，再把 tgz 交给它。
  const tempDir = await mkdtemp(join(tmpdir(), "perryfinn-attw-"));

  try {
    const tarballPath = await getPackedTarballPath(packageDir, tempDir);
    await $`bun x attw ${tarballPath} --profile ${profile}`.cwd(packageDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

await main();
