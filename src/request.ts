import axios, { AxiosRequestConfig } from "axios";
import { EndpointMap, EndpointName, QueuedCall } from "./types";
import { CacheProvider } from "./cache/cacheProvider";
import { CacheConfig, defaultCacheConfig } from "./cache/cacheConfig";
import { RateLimiterProvider } from "./rateLimit";

/**
 * API Error class
 */
export class ApiError extends Error {
  status?: number;
  details?: unknown;
  url?: string;

  constructor(message: string, status?: number, details?: unknown, url?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.url = url;
  }
}

/**
 * Build ApiError from an axios-style caught error
 */
function apiErrorFromCaught(error: unknown, url?: string): ApiError {
  const e = error as {
    message: string;
    response?: { status: number; data: unknown };
    config?: { url?: string };
  };
  return new ApiError(
    e.message,
    e.response?.status,
    e.response?.data,
    url ?? e.config?.url
  );
}

/**
 * Parse a single procedure result from a tRPC-style HTTP batch array item.
 * Success responses include `result`; failures include `error`.
 */
function apiErrorFromBatchProcedureError(item: unknown): ApiError | null {
  if (item === null || typeof item !== "object") {
    return null;
  }
  const o = item as Record<string, unknown>;
  if (!("error" in o) || o.error === null || o.error === undefined) {
    return null;
  }
  const err = o.error as Record<string, unknown>;
  const nested =
    err.json !== null &&
    err.json !== undefined &&
    typeof err.json === "object"
      ? (err.json as Record<string, unknown>)
      : err;
  const message =
    (typeof nested.message === "string" && nested.message) ||
    (typeof err.message === "string" && err.message) ||
    "Request failed";
  let httpStatus: number | undefined;
  const data = nested.data ?? err.data;
  if (data !== null && data !== undefined && typeof data === "object") {
    const hs = (data as { httpStatus?: unknown }).httpStatus;
    if (typeof hs === "number") {
      httpStatus = hs;
    }
  }
  return new ApiError(message, httpStatus, o.error);
}

/**
 * Request context configuration options
 */
export interface RequestContextOptions {
  baseUrl: string;
  batchMode?: boolean;
  cache?: CacheProvider | null;
  rateLimiter?: RateLimiterProvider | null;
  apiKey?: string;
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
  private rateLimiter: RateLimiterProvider | null;
  private apiKey: string | undefined;

  constructor(options: RequestContextOptions) {
    this.baseUrl = options.baseUrl;
    this.batchMode = options.batchMode ?? false;
    this.cache = options.cache ?? null;
    this.rateLimiter = options.rateLimiter ?? null;
    this.apiKey = options.apiKey;
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

  getRateLimiter(): RateLimiterProvider | null {
    return this.rateLimiter;
  }

  queueCall<T>(name: string, params: Record<string, unknown>, ttl?: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        name,
        params,
        resolve: resolve as (value: unknown) => void,
        reject,
        ttl,
      });
    });
  }

  /**
   * Flush the batch queue. Per-call promises resolve or reject independently:
   * tRPC batch items with an `error` field reject with {@link ApiError}; successes resolve.
   * If the batch HTTP request fails, cached entries still resolve; only uncached calls reject.
   * The returned array aligns with the queue order; failed procedure slots may be empty.
   */
  async executeBatch(ttl?: number): Promise<unknown[]> {
    if (this.queue.length === 0) {
      return [];
    }

    const cacheTTL = ttl ?? defaultCacheConfig.ttl!;
    const results: unknown[] = new Array(this.queue.length);
    /** Queue indices that still need a network batch (set after cache pre-check) */
    let indicesNeedingNetwork: number[] = [];

    try {
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

      indicesNeedingNetwork = [...missingIndexes];

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

      const batchUrl = `${this.baseUrl}/${batchFunctionNames}`;

      const response = await axios.get<unknown[]>(batchUrl, {
        params: {
          input: JSON.stringify(reducedInputObj),
          batch: 1,
        },
        headers: this.apiKey ? { "X-API-Key": this.apiKey } : undefined,
      } as AxiosRequestConfig);

      const fetchedResults = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // 5. Merge fetched results; each item may be a tRPC success (`result`) or failure (`error`)
      const rejections = new Map<number, ApiError>();
      missingIndexes.forEach((originalIndex, i) => {
        if (i >= fetchedResults.length) {
          rejections.set(
            originalIndex,
            new ApiError(
              "Batch response length does not match batch request",
              undefined,
              {
                expectedAtLeast: i + 1,
                received: fetchedResults.length,
              }
            )
          );
          return;
        }
        const item = fetchedResults[i];
        const procErr = apiErrorFromBatchProcedureError(item);
        if (procErr) {
          const call = this.queue[originalIndex];
          procErr.url = `${this.baseUrl}/${call.name}`;
          rejections.set(originalIndex, procErr);
          return;
        }
        results[originalIndex] = item;
      });

      // 6. Cache only successful fetched results
      if (this.cache) {
        await Promise.all(
          missingIndexes.map(async (originalIndex, i) => {
            if (rejections.has(originalIndex) || i >= fetchedResults.length) {
              return;
            }
            const call = this.queue[originalIndex];
            const cacheKey = this.getCacheKey(call.name, call.params);
            const callTTL = call.ttl ?? cacheTTL;
            await this.cache!.set(
              cacheKey,
              results[originalIndex],
              callTTL
            );
          })
        );
      }

      // 7. Resolve or reject each queued promise individually
      this.queue.forEach((call, index) => {
        const err = rejections.get(index);
        if (err) {
          call.reject(err);
        } else {
          call.resolve(results[index]);
        }
      });

      this.queue = [];
      return results;
    } catch (error) {
      const batchFunctionNames =
        indicesNeedingNetwork.length > 0
          ? indicesNeedingNetwork
              .map((index) => this.queue[index]?.name)
              .filter(Boolean)
              .join(",")
          : "";
      const batchUrl = batchFunctionNames
        ? `${this.baseUrl}/${batchFunctionNames}`
        : undefined;
      const errorObj = apiErrorFromCaught(error, batchUrl);

      if (indicesNeedingNetwork.length > 0) {
        const needNet = new Set(indicesNeedingNetwork);
        this.queue.forEach((call, index) => {
          if (needNet.has(index)) {
            call.reject(errorObj);
          } else {
            call.resolve(results[index]);
          }
        });
      } else {
        this.queue.forEach((call) => call.reject(errorObj));
      }

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
    const ttl = config.ttl ?? defaultCacheConfig.ttl!;

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
      // Queue the call and return a promise, preserving the TTL for when the batch is executed
      return this.queueCall<EndpointMap[K]["response"]>(
        endpointName,
        params as Record<string, unknown>,
        ttl
      );
    } else {
      // Apply rate limiting before making the request
      if (this.rateLimiter) {
        await this.rateLimiter.acquire();
      }

      // Execute immediately
      const requestUrl = `${this.baseUrl}/${endpointName}`;
      try {
        const response = await axios.get<EndpointMap[K]["response"]>(requestUrl, {
          params: {
            input: JSON.stringify(params),
          },
          headers: this.apiKey ? { "X-API-Key": this.apiKey } : undefined,
        } as AxiosRequestConfig);

        // Cache the response
        if (shouldCache && cacheKey) {
          await cache.set(cacheKey, response.data, ttl);
        }

        return response.data;
      } catch (error) {
        throw apiErrorFromCaught(error, requestUrl);
      }
    }
  }
}
