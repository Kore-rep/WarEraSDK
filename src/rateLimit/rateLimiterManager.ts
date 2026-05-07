import { RateLimiter } from "./rateLimiter";
import { RateLimiterProvider } from "./rateLimiterProvider";
import { RateLimitConfig } from "./rateLimitConfig";

/**
 * Creates a rate limiter instance based on the provided configuration.
 * 
 * @param customRateLimiter - Optional custom rate limiter provider:
 *   - If `null`, returns null (no rate limiting)
 *   - If a RateLimiterProvider instance, returns that instance
 *   - If `undefined` and config is provided, creates and returns a RateLimiter
 * @param config - Optional rate limit configuration (used only if customRateLimiter is undefined)
 * @returns A RateLimiterProvider instance or null
 */
export function createRateLimiter(
  customRateLimiter?: RateLimiterProvider | null,
  config?: Partial<RateLimitConfig>
): RateLimiterProvider | null {
  if (customRateLimiter === null) {
    return null;
  }

  if (customRateLimiter) {
    return customRateLimiter;
  }

  // If config is provided, create a RateLimiter
  if (config) {
    return new RateLimiter(config);
  }

  // No rate limiting if neither custom limiter nor config provided
  return null;
}
