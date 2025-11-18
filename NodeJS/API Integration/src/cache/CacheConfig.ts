/**
 * Cache configuration for specific endpoints
 */
export interface CacheConfig {
  ttl?: number;
  enabled?: boolean;
}

export const defaultCacheConfig: CacheConfig = {
  enabled: true,
  ttl: 30000,
};
