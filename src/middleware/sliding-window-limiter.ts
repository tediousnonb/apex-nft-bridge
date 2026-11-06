export class SlidingWindowRateLimiter {
  private timestamps: Map<string, number[]> = new Map();

  constructor(private windowMs: number = 60000, private maxRequests: number = 100) {}

  public isAllowed(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const history = this.timestamps.get(clientId) || [];

    const active = history.filter(ts => ts > windowStart);
    if (active.length >= this.maxRequests) {
      return false;
    }

    active.push(now);
    this.timestamps.set(clientId, active);
    return true;
  }
}
