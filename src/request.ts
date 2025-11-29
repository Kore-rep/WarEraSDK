import axios, { AxiosRequestConfig } from "axios";
import { EndpointMap, EndpointName, QueuedCall } from "./types";
import { CacheProvider } from "./cache/cacheProvider";
import { CacheConfig, defaultCacheConfig } from "./cache/cacheConfig";
import { RateLimiter, RateLimitConfig } from "./rateLimit";

/**
 * API Error class
 */
export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Request context configuration options
 */
export interface RequestContextOptions {
  baseUrl: string;
  batchMode?: boolean;
  cache?: CacheProvider | null;
  rateLimit?: Partial<RateLimitConfig>;
}

/**
 * Request context that manages batch mode, caching, and rate limiting.
 * Each API client instance should create its own RequestContext.
 */
export class RequestContext {
  private batchMode: boolean;
  private queue: QueuedCall<unknown>[] = [];
  private baseUrl: string;
  private cache: CacheProvider | null;
  private rateLimiter: RateLimiter | null;

  constructor(options: RequestContextOptions) {
    this.baseUrl = options.baseUrl;
    this.batchMode = options.batchMode ?? false;
    this.cache = options.cache ?? null;
    this.rateLimiter = options.rateLimit
      ? new RateLimiter(options.rateLimit)
      : null;
  }

  setBatchMode(enabled: boolean): void {
    this.batchMode = enabled;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  isBatchMode(): boolean {
    return this.batchMode;
  }

  getCache(): CacheProvider | null {
    return this.cache;
  }

  setCache(cache: CacheProvider | null): void {
    this.cache = cache;
  }

  getRateLimiter(): RateLimiter | null {
    return this.rateLimiter;
  }

  queueCall<T>(name: string, params: Record<string, unknown>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        name,
        params,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
    });
  }

  async executeBatch(): Promise<unknown[]> {
    if (this.queue.length === 0) {
      return [];
    }

    try {
      const results: unknown[] = new Array(this.queue.length);
      const missingIndexes: number[] = [];
      const missingFunctionNames: string[] = [];
      const missingInput: Record<string, unknown>[] = [];

      // 1. Pre-check cache for each queued call
      if (this.cache) {
        await Promise.all(
          this.queue.map(async (call, index) => {
            const cacheKey = this.getCacheKey(call.name, call.params);
            const cached = await this.cache!.get<unknown>(cacheKey);

            if (cached !== undefined) {
              // Fill from cache
              results[index] = cached;
            } else {
              // Mark for batch request
              missingIndexes.push(index);
              missingFunctionNames.push(call.name);
              missingInput.push(call.params);
            }
          })
        );
      } else {
        // No cache provider, all calls must be fetched
        this.queue.forEach((call, index) => {
          missingIndexes.push(index);
          missingFunctionNames.push(call.name);
          missingInput.push(call.params);
        });
      }

      // 2. If everything was cached, return immediately
      if (missingIndexes.length === 0) {
        this.queue.forEach((call, index) => call.resolve(results[index]));
        this.queue = [];
        return results;
      }

      // 3. Apply rate limiting before making the batch request
      if (this.rateLimiter) {
        await this.rateLimiter.acquire();
      }

      // 4. Execute batch request only for the missing items
      const batchFunctionNames = missingFunctionNames.join(",");
      const reducedInputObj: Record<string, Record<string, unknown>> = {};

      missingInput.forEach((params, i) => {
        reducedInputObj[i] = params;
      });

      const url = `${this.baseUrl}/${batchFunctionNames}`;

      const response = await axios.get<unknown[]>(url, {
        params: {
          input: JSON.stringify(reducedInputObj),
          batch: 1,
        },
      } as AxiosRequestConfig);

      const fetchedResults = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // 5. Merge fetched results back into the global results array
      missingIndexes.forEach((originalIndex, i) => {
        results[originalIndex] = fetchedResults[i];
      });

      // 6. Cache newly fetched results
      if (this.cache) {
        await Promise.all(
          missingIndexes.map(async (originalIndex, i) => {
            const call = this.queue[originalIndex];
            const cacheKey = this.getCacheKey(call.name, call.params);
            await this.cache!.set(
              cacheKey,
              fetchedResults[i],
              defaultCacheConfig.ttl
            );
          })
        );
      }

      // 7. Resolve queued promises
      this.queue.forEach((call, index) => {
        call.resolve(results[index]);
      });

      this.queue = [];
      return results;
    } catch (error) {
      const apiError = error as {
        message: string;
        response?: { status: number; data: unknown };
      };

      const errorObj = new ApiError(
        apiError.message,
        apiError.response?.status,
        apiError.response?.data
      );

      // Reject all queued calls
      this.queue.forEach((call) => call.reject(errorObj));
      this.queue = [];

      throw errorObj;
    }
  }

  clearQueue(): void {
    this.queue = [];
  }

  getCacheKey(endpointName: string, params: Record<string, unknown>): string {
    // Create a deterministic cache key from endpoint name and params
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);

    return `${endpointName}:${JSON.stringify(sortedParams)}`;
  }

  async invalidateCacheKey(key: string): Promise<void> {
    if (this.cache) {
      await this.cache.del(key);
    }
  }

  /**
   * Make a request - handles rate limiting, caching, batching, or immediate execution
   */
  async request<K extends EndpointName>(
    endpointName: K,
    params: EndpointMap[K]["params"],
    cacheConfig?: CacheConfig
  ): Promise<EndpointMap[K]["response"]> {
    const cache = this.cache;

    const config = cacheConfig || defaultCacheConfig;
    const shouldCache = cache && config.enabled !== false;
    const ttl = config.ttl ?? defaultCacheConfig.ttl;

    // Generate cache key
    const cacheKey = shouldCache
      ? this.getCacheKey(endpointName, params as Record<string, unknown>)
      : null;

    // Check cache first (only for non-batch mode)
    if (shouldCache && !this.batchMode && cacheKey) {
      const cached = await cache.get<EndpointMap[K]["response"]>(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    if (this.batchMode) {
      // Queue the call and return a promise
      return this.queueCall<EndpointMap[K]["response"]>(
        endpointName,
        params as Record<string, unknown>
      );
    } else {
      // Apply rate limiting before making the request
      if (this.rateLimiter) {
        await this.rateLimiter.acquire();
      }

      // Execute immediately
      try {
        const url = `${this.baseUrl}/${endpointName}`;
        const response = await axios.get<EndpointMap[K]["response"]>(url, {
          params: {
            input: JSON.stringify(params),
          },
        } as AxiosRequestConfig);

        // Cache the response
        if (shouldCache && cacheKey) {
          await cache.set(cacheKey, response.data, ttl);
        }

        return response.data;
      } catch (error) {
        const apiError = error as {
          message: string;
          response?: { status: number; data: unknown };
        };
        throw new ApiError(
          apiError.message,
          apiError.response?.status,
          apiError.response?.data
        );
      }
    }
  }
}
