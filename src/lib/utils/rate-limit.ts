import "server-only";

type Bucket = { count: number; resetAt: number };

/**
 * Rate limit đơn giản trong bộ nhớ (fixed window).
 * Đủ dùng cho VPS một instance. Trên môi trường serverless nhiều instance (Vercel),
 * nên kết hợp thêm WAF/Rate limiting rule của Cloudflare hoặc store dùng chung (Redis/Upstash).
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return function check(key: string) {
    const now = Date.now();

    if (buckets.size > 5_000) {
      for (const [k, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(k);
    }

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfter: 0 };
    }

    bucket.count += 1;
    if (bucket.count > limit) {
      return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
    }
    return { allowed: true, retryAfter: 0 };
  };
}
