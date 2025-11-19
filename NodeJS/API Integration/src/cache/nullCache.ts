import { CacheProvider } from "./cacheProvider.js";

export class NullCache implements CacheProvider {
  async get<T>(_key: string): Promise<T | undefined> {
    return undefined;
  }

  async set(_key: string, _value: unknown, _ttl?: number): Promise<void> {
    // No-op: doesn't store anything
    return;
  }

  async del(_key: string): Promise<void> {
    // No-op: nothing to delete
    return;
  }

  async reset(): Promise<void> {
    // No-op: nothing to reset
    return;
  }
}
