import { CacheManagerAdapter } from "./cacheManagerAdapter";
import { CacheProvider } from "./cacheProvider";
import { createCache } from "cache-manager";
import { NullCache } from "./nullCache";

/**
 * Creates a cache provider instance based on the provided configuration.
 * 
 * @param customCache - Optional custom cache provider:
 *   - If `null`, returns a NullCache (no-op cache)
 *   - If a CacheProvider instance, returns that instance
 *   - If `undefined`, creates and returns an in-memory cache
 * @returns A CacheProvider instance
 */
export function createCacheProvider(customCache?: CacheProvider | null): CacheProvider {
  if (customCache === null) {
    return new NullCache();
  }

  if (customCache) {
    return customCache;
  }

  const memoryCache = createCache();
  return new CacheManagerAdapter(memoryCache);
}

/**
 * @deprecated Use createCacheProvider() instead. This class uses a singleton pattern
 * that can cause issues when multiple API clients are created.
 */
export class CacheManager {
  private static instance: CacheProvider | null = null;

  /**
   * @deprecated Use createCacheProvider() instead.
   * Creates a singleton instance of the cache.
   */
  static getCache(customCache?: CacheProvider | null): CacheProvider {
    if (this.instance) {
      return this.instance;
    }
    return this.setCache(customCache);
  }

  /**
   * @deprecated Use createCacheProvider() instead.
   */
  static setCache(customCache?: CacheProvider | null): CacheProvider {
    if (customCache === null) {
      this.instance = new NullCache();
      return this.instance;
    }

    if (customCache) {
      this.instance = customCache;
      return this.instance;
    }

    const memoryCache = createCache();
    this.instance = new CacheManagerAdapter(memoryCache);
    return this.instance;
  }

  static reset(): void {
    this.instance = null;
  }
}
