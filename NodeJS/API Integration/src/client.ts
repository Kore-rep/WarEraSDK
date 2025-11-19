import { CacheProvider } from "cache/cacheProvider";
import { APIClient, ResourceWrapper } from "./DTOs/api.dto";
import { requestContext } from "./request";
import { article } from "./resources/article";
import { battle } from "./resources/battle";
import { battleRanking } from "./resources/battleRanking";
import { company } from "./resources/company";
import { country } from "./resources/country";
import { gameConfig } from "./resources/gameConfig";
import { government } from "./resources/government";
import { itemOffer } from "./resources/itemOffer";
import { itemTrading } from "./resources/itemTrading";
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
import { CacheManager } from "./cache/cacheManager";

const DEFAULT_BASE_URL = "https://api.example.com"; // TODO: Replace with actual API URL

type ResourceMethods = Record<
  string,
  (baseUrl: string, ...args: never[]) => Promise<unknown>
>;

export function createAPI(
  config: APIConfig = {},
  customCacheProvider?: CacheProvider | null
): APIClient {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const batchMode = config.batch || false;

  // Init cache
  CacheManager.getCache(customCacheProvider);

  // Set up the request context
  requestContext.setBatchMode(batchMode);
  requestContext.setBaseUrl(baseUrl);

  // Create resource wrappers that bind baseUrl to each function
  const createResourceWrapper = <T extends ResourceMethods>(
    resource: T
  ): ResourceWrapper<T> => {
    const wrapper = {} as ResourceWrapper<T>;
    for (const [key, fn] of Object.entries(resource)) {
      if (typeof fn === "function") {
        (wrapper as Record<string, (...args: unknown[]) => Promise<unknown>>)[
          key
        ] = (...args: unknown[]) =>
          (fn as (baseUrl: string, ...args: unknown[]) => Promise<unknown>)(
            baseUrl,
            ...args
          );
      }
    }
    return wrapper;
  };

  return {
    company: createResourceWrapper(company),
    country: createResourceWrapper(country),
    government: createResourceWrapper(government),
    region: createResourceWrapper(region),
    battle: createResourceWrapper(battle),
    round: createResourceWrapper(round),
    battleRanking: createResourceWrapper(battleRanking),
    itemTrading: createResourceWrapper(itemTrading),
    tradingOrder: createResourceWrapper(tradingOrder),
    itemOffer: createResourceWrapper(itemOffer),
    workOffer: createResourceWrapper(workOffer),
    ranking: createResourceWrapper(ranking),
    search: createResourceWrapper(search),
    gameConfig: createResourceWrapper(gameConfig),
    user: createResourceWrapper(user),
    article: createResourceWrapper(article),
    mu: createResourceWrapper(mu),
    transaction: createResourceWrapper(transaction),
    upgrade: createResourceWrapper(upgrade),

    /**
     * Execute all queued batch requests
     * @returns Promise resolving to an array of results
     */
    runBatch: async () => {
      return requestContext.executeBatch();
    },

    /**
     * Clear the batch queue without executing
     */
    clearBatch: () => {
      requestContext.clearQueue();
    },

    /**
     * Invalidate a specific cache key
     */
    invalidateCache: async (
      endpointName: string,
      params: Record<string, unknown>
    ) => {
      const key = requestContext.getCacheKey(endpointName, params);
      return requestContext.invalidateCacheKey(key);
    },
  };
}
