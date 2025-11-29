import { CacheManagerAdapter } from "./cacheManagerAdapter";
import { CacheProvider } from "./cacheProvider";
import { createCache } from "cache-manager";
import { NullCache } from "./nullCache";

export class CacheManager {
  private static instance: CacheProvider | null = null;

  /**
   * Creates a singleton instance of the cache, either an in-memory cache or a wrapper on top of whatever custom cache is provided.
   * @param customCache An optional Custom provider that the cache will use.
   * @returns A singleton CacheProvider instance
   */
  static getCache(customCache?: CacheProvider | null): CacheProvider {
    // Return existing instance if already initialized
    if (this.instance) {
      return this.instance;
    }
    return this.setCache(customCache);
  }
  // TODO: This is terrible, when request context singleton pattern is fixed, fix this
  static setCache(customCache?: CacheProvider | null) {
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
