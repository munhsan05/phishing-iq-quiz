import { describe, it, expect } from "vitest";
import {
  mean,
  standardDeviation,
  pairedTTest,
  cohensD,
  interpretCohensD,
  interpretPValue,
} from "../statistics";

describe("mean", () => {
  it("returns 0 for empty array", () => {
    expect(mean([])).toBe(0);
  });
  it("computes correct mean", () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });
  it("handles single value", () => {
    expect(mean([7])).toBe(7);
  });
});

describe("standardDeviation", () => {
  it("returns 0 for single value", () => {
    expect(standardDeviation([5])).toBe(0);
  });
  it("computes sample standard deviation", () => {
    const sd = standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(sd).toBeCloseTo(2.138, 2);
  });
});

describe("pairedTTest", () => {
  it("returns p=1 for mismatched lengths", () => {
    const result = pairedTTest([1, 2], [1]);
    expect(result.pValue).toBe(1);
  });
  it("detects significant improvement", () => {
    const pre = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    const post = [1, 1, 1, 0, 1, 1, 1, 0, 1, 1];
    const result = pairedTTest(pre, post);
    expect(result.tValue).toBeGreaterThan(0);
    expect(result.pValue).toBeLessThan(0.05);
    expect(result.df).toBe(9);
  });
  it("detects no significant difference", () => {
    const pre = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
    const post = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
    const result = pairedTTest(pre, post);
    expect(result.pValue).toBeGreaterThan(0.05);
  });
});

describe("cohensD", () => {
  it("returns 0 for identical arrays", () => {
    expect(cohensD([1, 1, 1], [1, 1, 1])).toBe(0);
  });
  it("returns large effect for strong improvement", () => {
    const pre = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
    const post = [1, 1, 1, 1, 1, 1, 1, 0, 1, 1];
    const d = cohensD(pre, post);
    expect(d).toBeGreaterThan(0.8);
  });
});

describe("interpretCohensD", () => {
  it("classifies effect sizes", () => {
    expect(interpretCohensD(0.1)).toBe("Бага нөлөө");
    expect(interpretCohensD(0.3)).toBe("Дунд нөлөө");
    expect(interpretCohensD(0.6)).toBe("Том нөлөө");
    expect(interpretCohensD(1.5)).toBe("Маш том нөлөө");
  });
});

describe("interpretPValue", () => {
  it("classifies p-values", () => {
    expect(interpretPValue(0.0005)).toContain("Маш өндөр");
    expect(interpretPValue(0.005)).toContain("Өндөр");
    expect(interpretPValue(0.03)).toContain("Статистик ач холбогдолтой");
    expect(interpretPValue(0.15)).toContain("ач холбогдолгүй");
  });
});
