import { describe, expect, it } from "vitest";
import { mockCore } from "../src";

describe("mockCore", () => {
  it("logs a fixed message", () => {
    const messages: string[] = [];

    mockCore({
      log: (message) => {
        messages.push(message);
      }
    });

    expect(messages).toEqual(["mockCore called"]);
  });
});
