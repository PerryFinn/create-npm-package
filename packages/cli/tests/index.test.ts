import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { isDirectRun, main } from "../src/index.js";
import { run } from "../src/run.js";

describe("run", () => {
  it("应输出默认就绪信息", () => {
    const messages: string[] = [];
    const code = run([], (message: string) => {
      messages.push(message);
    });

    expect(code).toBe(0);
    expect(messages).toEqual(["perryfinn cli ready"]);
  });

  it("应输出帮助信息", () => {
    const messages: string[] = [];
    const code = run(["--help"], (message: string) => {
      messages.push(message);
    });

    expect(code).toBe(0);
    expect(messages[0]).toContain("Usage: perryfinn [options]");
  });
});

describe("main", () => {
  it("应把参数交给 CLI runner 处理", () => {
    const messages: string[] = [];
    const code = main(["--help"], (message: string) => {
      messages.push(message);
    });

    expect(code).toBe(0);
    expect(messages[0]).toContain("Usage: perryfinn [options]");
  });

  it("应识别通过符号链接路径直接执行的入口", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "perryfinn-cli-entry-"));

    try {
      const realEntry = join(tempDir, "index.cjs");
      const linkedEntry = join(tempDir, "linked-index.cjs");
      await writeFile(realEntry, "");
      await symlink(realEntry, linkedEntry);

      expect(isDirectRun(linkedEntry, pathToFileURL(realEntry).href)).toBe(true);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("当入口路径无法解析时应返回 false", () => {
    const moduleUrl = pathToFileURL(process.cwd()).href;

    expect(isDirectRun(undefined, moduleUrl)).toBe(false);
    expect(isDirectRun("/path/that/does/not/exist", moduleUrl)).toBe(false);
  });
});
