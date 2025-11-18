import { CacheManagerAdapter } from "./cacheManagerAdapter";
import { CacheProvider } from "./cacheProvider";
import { createCache } from "cache-manager";

export class CacheManager {
  private static instance: CacheProvider | null = null;

  static getDefaultCache(): CacheProvider {
    // Return existing instance if already initialized
    if (this.instance) {
      return this.instance;
    }

    // Initialize cache (only happens once)
    const memoryCache = createCache();
    this.instance = new CacheManagerAdapter(memoryCache);
    return this.instance;
  }

  static reset(): void {
    this.instance = null;
  }
}
