/**
 * Configuration for rate limiting
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed per time window.
   * @default 100
   */
  maxRequests: number;

  /**
   * Time window in milliseconds.
   * @default 60000 (1 minute)
   */
  windowMs: number;

  /**
   * Percentage of limit (0-1) at which to start backing off.
   * E.g., 0.7 means start slowing down at 70% of the limit.
   * @default 0.7
   */
  backoffThreshold: number;

  /**
   * Maximum delay in milliseconds when at the limit.
   * @default 5000
   */
  maxBackoffMs: number;

  /**
   * Whether to throw an error when rate limit is exceeded.
   * If false, requests will be delayed instead.
   * @default false
   */
  throwOnLimit: boolean;
}

export const defaultRateLimitConfig: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000,
  backoffThreshold: 0.7,
  maxBackoffMs: 5000,
  throwOnLimit: false,
};

