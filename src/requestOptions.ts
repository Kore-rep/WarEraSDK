import { CacheConfig } from "./cache/cacheConfig";

/**
 * Common per-request options accepted by every resource method.
 */
export interface RequestOptions {
  /**
   * Cache configuration for this specific request.
   * - `ttl`: Time-to-live in milliseconds (default: 30s)
   * - `enabled`: Set to false to bypass the cache entirely for this request —
   *   no cached value is returned and the fresh response is not stored.
   */
  cache?: CacheConfig;
}
