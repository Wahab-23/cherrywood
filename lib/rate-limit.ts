export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, options: RateLimitOptions) {
  const now = Date.now();
  const resetTime = now + options.windowMs;

  let record = store.get(ip);

  // If record doesn't exist or has expired, create a new one
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime };
    store.set(ip, record);
    return { success: true, remaining: options.limit - 1, resetTime };
  }

  // Increment existing record
  record.count += 1;

  if (record.count > options.limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  return { success: true, remaining: options.limit - record.count, resetTime: record.resetTime };
}
