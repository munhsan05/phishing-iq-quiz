/**
 * Statistical functions for pre/post test comparison.
 * Paired t-test, Cohen's d, and interpretation helpers.
 * Self-contained — no external stats library needed.
 */

/** Arithmetic mean. Returns 0 for empty array. */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Sample standard deviation. Returns 0 for n <= 1. */
export function standardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const m = mean(values);
  const squaredDiffs = values.map((v) => (v - m) ** 2);
  return Math.sqrt(
    squaredDiffs.reduce((sum, v) => sum + v, 0) / (values.length - 1),
  );
}

/**
 * Paired two-tailed t-test for pre/post scores.
 * Input: arrays of per-question scores (0 or 1) of equal length.
 */
export function pairedTTest(
  pre: number[],
  post: number[],
): { tValue: number; pValue: number; df: number } {
  if (pre.length !== post.length || pre.length < 2) {
    return { tValue: 0, pValue: 1, df: 0 };
  }

  const differences = pre.map((v, i) => post[i] - v);
  const n = differences.length;
  const meanDiff = mean(differences);
  const sdDiff = standardDeviation(differences);
  const df = n - 1;

  if (sdDiff === 0) {
    return {
      tValue: meanDiff === 0 ? 0 : Infinity,
      pValue: meanDiff === 0 ? 1 : 0,
      df,
    };
  }

  const tValue = meanDiff / (sdDiff / Math.sqrt(n));
  const pValue = tDistTwoTailP(Math.abs(tValue), df);

  return { tValue, pValue, df };
}

/**
 * Cohen's d for paired samples (effect size).
 */
export function cohensD(pre: number[], post: number[]): number {
  if (pre.length !== post.length || pre.length < 2) return 0;

  const differences = pre.map((v, i) => post[i] - v);
  const meanDiff = mean(differences);
  const sdDiff = standardDeviation(differences);

  if (sdDiff === 0) return meanDiff === 0 ? 0 : Infinity;
  return meanDiff / sdDiff;
}

/** Interpret Cohen's d magnitude (Монгол). */
export function interpretCohensD(d: number): string {
  const abs = Math.abs(d);
  if (abs < 0.2) return "Бага нөлөө";
  if (abs < 0.5) return "Дунд нөлөө";
  if (abs < 0.8) return "Том нөлөө";
  return "Маш том нөлөө";
}

/** Interpret p-value significance (Монгол). */
export function interpretPValue(p: number): string {
  if (p < 0.001) return "Маш өндөр ач холбогдолтой (p < 0.001)";
  if (p < 0.01) return "Өндөр ач холбогдолтой (p < 0.01)";
  if (p < 0.05) return "Статистик ач холбогдолтой (p < 0.05)";
  return "Статистик ач холбогдолгүй (p ≥ 0.05)";
}

// ============================================
// Internal: t-distribution p-value approximation
// ============================================

function tDistTwoTailP(absT: number, df: number): number {
  if (df <= 0) return 1;
  if (absT === 0) return 1;
  if (!isFinite(absT)) return 0;

  const x = df / (df + absT * absT);
  const p = regularizedBeta(x, df / 2, 0.5);
  return Math.min(1, Math.max(0, p));
}

function regularizedBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularizedBeta(1 - x, b, a);
  }

  const lbeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta) / a;

  const EPS = 1e-14;
  const TINY = 1e-30;
  let f = TINY;
  let c = TINY;
  let d = 1 - (a + b) * x / (a + 1);
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  f = d;

  for (let m = 1; m <= 200; m++) {
    let num = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + num * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + num / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    f *= d * c;

    num = (-(a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + num * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + num / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    f *= delta;

    if (Math.abs(delta - 1) < EPS) break;
  }

  return front * f;
}

function logGamma(x: number): number {
  const COEFFS = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  }

  x -= 1;
  let a = COEFFS[0];
  for (let i = 1; i < 9; i++) {
    a += COEFFS[i] / (x + i);
  }
  const t = x + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
