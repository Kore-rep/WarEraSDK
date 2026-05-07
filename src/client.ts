import { APIClient } from "./DTOs/api.dto";
import { RequestContext } from "./request";
import { article } from "./resources/article";
import { battle } from "./resources/battle";
import { battleRanking } from "./resources/battleRanking";
import { company } from "./resources/company";
import { country } from "./resources/country";
import { gameConfig } from "./resources/gameConfig";
import { government } from "./resources/government";
import { inventoryAccount } from "./resources/inventoryAccount";
import { itemOffer } from "./resources/itemOffer";
import { itemTrading } from "./resources/itemTrading";
import { laws } from "./resources/laws";
import { mercenaryContractAuction } from "./resources/mercenaryContractAuction";
import { message } from "./resources/message";
import { party } from "./resources/party";
import { mu } from "./resources/mu";
import { ranking } from "./resources/ranking";
import { region } from "./resources/region";
import { round } from "./resources/round";
import { search } from "./resources/search";
import { tradingOrder } from "./resources/tradingOrder";
import { transaction } from "./resources/transaction";
import { upgrade } from "./resources/upgrade";
import { user } from "./resources/user";
import { workOffer } from "./resources/workOffer";
import { APIConfig } from "./types";
import { createCacheProvider } from "./cache/cacheManager";
import { createRateLimiter, RateLimiterProvider } from "./rateLimit";
import { RateLimitConfig } from "./rateLimit/rateLimitConfig";

const DEFAULT_BASE_URL = "https://api.example.com"; // TODO: Replace with actual API URL

/**
 * Creates a new API client instance with its own isolated request context.
 * Each client instance is independent and does not share state with other instances.
 *
 * @param config - API configuration options including cache, rate limiting, etc.
 * @returns A fully configured API client
 */
export function createAPI(config: APIConfig = {}): APIClient {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const batchMode = config.batch || false;

  // Create cache provider for this client instance
  const cache = createCacheProvider(config.cache);

  // Create rate limiter - use custom provider if provided, otherwise use config
  const customRateLimiter: RateLimiterProvider | null | undefined = config.rateLimiter;
  const rateLimitConfig: Partial<RateLimitConfig> | undefined = config.rateLimitConfig;
  const rateLimiter = createRateLimiter(customRateLimiter, rateLimitConfig);

  // Create a new request context for this client instance
  const ctx = new RequestContext({
    baseUrl,
    batchMode,
    cache,
    rateLimiter,
    apiKey: config.apiKey,
  });

  return {
    company: company(ctx),
    country: country(ctx),
    party: party(ctx),
    government: government(ctx),
    laws: laws(ctx),
    region: region(ctx),
    battle: battle(ctx),
    round: round(ctx),
    battleRanking: battleRanking(ctx),
    mercenaryContractAuction: mercenaryContractAuction(ctx),
    itemTrading: itemTrading(ctx),
    tradingOrder: tradingOrder(ctx),
    itemOffer: itemOffer(ctx),
    workOffer: workOffer(ctx),
    ranking: ranking(ctx),
    search: search(ctx),
    gameConfig: gameConfig(ctx),
    user: user(ctx),
    article: article(ctx),
    message: message(ctx),
    mu: mu(ctx),
    transaction: transaction(ctx),
    upgrade: upgrade(ctx),
    inventoryAccount: inventoryAccount(ctx),

    /**
     * Execute all queued batch requests. Each queued call resolves or rejects on its own;
     * a successful HTTP batch with per-procedure errors does not fail the whole batch.
     * @param ttl - Optional TTL in milliseconds for caching batch results
     * @returns Array aligned with enqueue order; entries may be empty where a call rejected
     */
    runBatch: async (ttl?: number) => {
      return ctx.executeBatch(ttl);
    },

    /**
     * Clear the batch queue without executing
     */
    clearBatch: () => {
      ctx.clearQueue();
    },

    /**
     * Invalidate a specific cache key
     */
    invalidateCache: async (
      endpointName: string,
      params: Record<string, unknown>
    ) => {
      const key = ctx.getCacheKey(endpointName, params);
      return ctx.invalidateCacheKey(key);
    },

    /**
     * Get current rate limit status.
     * Returns null if rate limiting is not enabled.
     */
    getRateLimitStatus: () => {
      const limiter = ctx.getRateLimiter();
      return limiter ? limiter.getStatus() : null;
    },
  };
}
