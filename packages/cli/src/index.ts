import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { CLIWrite } from "./run.js";
import { run } from "./run.js";

export const main = (args: string[] = process.argv.slice(2), write?: CLIWrite): number => run(args, write);

export const isDirectRun = (entryPath: string | undefined, moduleUrl: string): boolean => {
  if (!entryPath) {
    return false;
  }

  try {
    return realpathSync(entryPath) === realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
};

if (isDirectRun(process.argv[1], import.meta.url)) {
  process.exitCode = main();
}
