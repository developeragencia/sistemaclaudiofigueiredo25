interface RateLimit {
  count: number;
  lastReset: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimit>;
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number, timeWindow: number) {
    this.limits = new Map();
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  tryRequest(key: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit) {
      this.limits.set(key, { count: 1, lastReset: now });
      return true;
    }

    if (now - limit.lastReset > this.timeWindow) {
      this.limits.set(key, { count: 1, lastReset: now });
      return true;
    }

    if (limit.count >= this.maxRequests) {
      return false;
    }

    limit.count++;
    return true;
  }

  reset(key: string): void {
    this.limits.delete(key);
  }

  resetAll(): void {
    this.limits.clear();
  }
} 