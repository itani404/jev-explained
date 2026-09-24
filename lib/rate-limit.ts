// Fixed-window limiter kept in memory. It resets on restart and isn't shared across
// server instances, which is fine for a local demo but not a production guard.
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  function prune(now: number) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < windowMs)) hits.delete(key);
    }
  }

  return {
    isLimited(key: string, now = Date.now()): boolean {
      if (hits.size > 1000) prune(now);
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      recent.push(now);
      hits.set(key, recent);
      return recent.length > limit;
    },
  };
}

export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'local';
}
