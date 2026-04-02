import { describe, expect, it } from "vitest";
import { run } from "../src/run.js";

describe("run", () => {
  it("prints default message", () => {
    const messages: string[] = [];
    const code = run([], (message: string) => {
      messages.push(message);
    });

    expect(code).toBe(0);
    expect(messages).toEqual(["perryfinn cli ready"]);
  });

  it("prints help message", () => {
    const messages: string[] = [];
    const code = run(["--help"], (message: string) => {
      messages.push(message);
    });

    expect(code).toBe(0);
    expect(messages[0]).toContain("Usage: perryfinn [options]");
  });
});
