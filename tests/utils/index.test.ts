import { describe, expect, it } from "vitest";
import { add } from "../../src/utils";

describe("add", () => {
  it("应返回两个数字之和", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, -1)).toBe(-2);
    expect(add(0, 0)).toBe(0);
  });

  it("应返回两个浮点数的和", () => {
    expect(add(1.1, 2.2)).toBeCloseTo(3.3);
    expect(add(-1.1, -1.1)).toBeCloseTo(-2.2);
  });

  it("应返回大数的和", () => {
    expect(add(1e10, 1e10)).toBe(2e10);
    expect(add(-1e10, -1e10)).toBe(-2e10);
  });

  it("当输入之一为NaN时，应返回NaN", () => {
    expect(add(Number.NaN, 1)).toBeNaN();
    expect(add(1, Number.NaN)).toBeNaN();
  });

  it("当输入之一为无穷大时，应返回无穷大", () => {
    expect(add(Number.POSITIVE_INFINITY, 1)).toBe(Number.POSITIVE_INFINITY);
    expect(add(1, Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
  });

  it("当输入之一为负无穷大时，应返回负无穷大", () => {
    expect(add(Number.NEGATIVE_INFINITY, 1)).toBe(Number.NEGATIVE_INFINITY);
    expect(add(1, Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
  });
});
