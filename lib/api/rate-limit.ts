/**
 * In-memory per-IP rate limiter. Process-local — good enough for a single
 * Next.js instance. For multi-instance / serverless deployments behind a
 * load balancer, swap the Map for Redis (Upstash etc.).
 *
 * Each `key` has its own counter + window, so multiple endpoints can use
 * the same module without colliding (`appointments`, `contact`, etc.).
 */
type Bucket = { count: number; resetTime: number };

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  /** Logical bucket name, e.g. "contact" or "appointments". */
  key: string;
  /** Window in milliseconds. */
  windowMs: number;
  /** Max requests permitted within the window. */
  max: number;
};

export function rateLimitCheck(
  ip: string,
  { key, windowMs, max }: RateLimitOptions
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const bucket = buckets.get(bucketKey);

  if (!bucket || now > bucket.resetTime) {
    buckets.set(bucketKey, { count: 1, resetTime: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetTime - now) / 1000)),
    };
  }

  bucket.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
