import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, _resetForTests } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => _resetForTests());

  it("allows up to max requests then blocks", () => {
    const ip = "1.1.1.1";
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
    expect(checkRateLimit(ip).allowed).toBe(false);
  });

  it("returns remaining count", () => {
    expect(checkRateLimit("2.2.2.2").remaining).toBe(9);
    expect(checkRateLimit("2.2.2.2").remaining).toBe(8);
  });

  it("isolates buckets per key", () => {
    for (let i = 0; i < 10; i++) checkRateLimit("a");
    expect(checkRateLimit("a").allowed).toBe(false);
    expect(checkRateLimit("b").allowed).toBe(true);
  });

  it("resets after window expires", () => {
    const ip = "3.3.3.3";
    for (let i = 0; i < 10; i++) checkRateLimit(ip, 10, 1);
    return new Promise((r) => setTimeout(r, 5)).then(() => {
      expect(checkRateLimit(ip, 10, 1).allowed).toBe(true);
    });
  });
});
