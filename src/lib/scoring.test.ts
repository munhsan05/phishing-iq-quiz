import { describe, it, expect } from "vitest";
import { scoreBinary, scoreBrowser, scoreInboxF1, scoreQuestion } from "./scoring";

describe("scoreBinary", () => {
  it("returns 1 for correct choice", () => {
    expect(scoreBinary({ isPhish: true, choice: "phish" })).toBe(1);
    expect(scoreBinary({ isPhish: false, choice: "legit" })).toBe(1);
  });
  it("returns 0 for wrong choice", () => {
    expect(scoreBinary({ isPhish: true, choice: "legit" })).toBe(0);
    expect(scoreBinary({ isPhish: false, choice: "phish" })).toBe(0);
  });
  it("returns 0 for timeout (null choice)", () => {
    expect(scoreBinary({ isPhish: true, choice: null })).toBe(0);
  });
});

describe("scoreBrowser", () => {
  it("phish + back = 1", () => {
    expect(scoreBrowser({ isPhish: true, choice: "back" })).toBe(1);
  });
  it("phish + report = 1.1 (bonus)", () => {
    expect(scoreBrowser({ isPhish: true, choice: "report" })).toBe(1.1);
  });
  it("phish + proceed = 0", () => {
    expect(scoreBrowser({ isPhish: true, choice: "proceed" })).toBe(0);
  });
  it("legit + proceed = 1", () => {
    expect(scoreBrowser({ isPhish: false, choice: "proceed" })).toBe(1);
  });
  it("legit + back or report = 0 (false positive)", () => {
    expect(scoreBrowser({ isPhish: false, choice: "back" })).toBe(0);
    expect(scoreBrowser({ isPhish: false, choice: "report" })).toBe(0);
  });
});

describe("scoreInboxF1", () => {
  it("all correct = 1.0", () => {
    expect(
      scoreInboxF1({
        phishIds: [1, 2],
        selectedIds: [1, 2],
      }),
    ).toBeCloseTo(1.0);
  });
  it("phish exists but none selected = 0 (recall=0)", () => {
    expect(
      scoreInboxF1({
        phishIds: [1, 2],
        selectedIds: [],
      }),
    ).toBe(0);
  });
  it("half precision, full recall", () => {
    expect(
      scoreInboxF1({
        phishIds: [1, 2],
        selectedIds: [1, 2, 3, 4],
      }),
    ).toBeCloseTo(0.667, 2);
  });
  it("no phish and no selections = 1.0", () => {
    expect(scoreInboxF1({ phishIds: [], selectedIds: [] })).toBe(1);
  });
});

describe("scoreQuestion dispatcher", () => {
  it("dispatches to correct scorer by type", () => {
    expect(scoreQuestion({ type: "email", isPhish: true, choice: "phish" })).toBe(1);
    expect(scoreQuestion({ type: "browser", isPhish: true, choice: "report" })).toBe(1.1);
  });
});
