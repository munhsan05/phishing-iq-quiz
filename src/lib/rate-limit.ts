type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function checkRateLimit(
  key: string,
  max = 10,
  windowMs = DAY_MS
): RateLimitResult {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now >= cur.resetAt) {
    const reset = now + windowMs;
    buckets.set(key, { count: 1, resetAt: reset });
    return { allowed: true, remaining: max - 1, resetAt: reset };
  }
  if (cur.count >= max) {
    return { allowed: false, remaining: 0, resetAt: cur.resetAt };
  }
  cur.count += 1;
  return { allowed: true, remaining: max - cur.count, resetAt: cur.resetAt };
}

export function _resetForTests() {
  buckets.clear();
}
