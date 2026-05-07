/**
 * Interface for rate limiter providers.
 * Allows users to provide custom rate limiting implementations.
 */
export interface RateLimiterProvider {
  /**
   * Acquire permission to make a request.
   * Will apply backoff delay if approaching limit.
   * If at limit, will either throw or wait based on implementation.
   * @throws {RateLimitError} If rate limit is exceeded and configured to throw
   */
  acquire(): Promise<void>;

  /**
   * Get current rate limit status for debugging/monitoring
   */
  getStatus(): {
    requestCount: number;
    maxRequests: number;
    usagePercent: number;
    isAtLimit: boolean;
    currentBackoffMs: number;
  };
}
