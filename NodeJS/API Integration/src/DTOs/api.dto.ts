import type { article } from '../resources/article';
import type { battle } from '../resources/battle';
import type { battleRanking } from '../resources/battleRanking';
import type { company } from '../resources/company';
import type { country } from '../resources/country';
import type { gameConfig } from '../resources/gameConfig';
import type { government } from '../resources/government';
import type { itemOffer } from '../resources/itemOffer';
import type { itemTrading } from '../resources/itemTrading';
import type { mu } from '../resources/mu';
import type { ranking } from '../resources/ranking';
import type { region } from '../resources/region';
import type { round } from '../resources/round';
import type { search } from '../resources/search';
import type { tradingOrder } from '../resources/tradingOrder';
import type { transaction } from '../resources/transaction';
import type { upgrade } from '../resources/upgrade';
import type { user } from '../resources/user';
import type { workOffer } from '../resources/workOffer';

/**
 * Resource wrapper type - removes the baseUrl parameter from all methods
 */
export type ResourceWrapper<T> = {
  [K in keyof T]: T[K] extends (baseUrl: string, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

/**
 * API Client interface - represents the complete API client with all resources
 */
export interface APIClient {
  company: ResourceWrapper<typeof company>;
  country: ResourceWrapper<typeof country>;
  government: ResourceWrapper<typeof government>;
  region: ResourceWrapper<typeof region>;
  battle: ResourceWrapper<typeof battle>;
  round: ResourceWrapper<typeof round>;
  battleRanking: ResourceWrapper<typeof battleRanking>;
  itemTrading: ResourceWrapper<typeof itemTrading>;
  tradingOrder: ResourceWrapper<typeof tradingOrder>;
  itemOffer: ResourceWrapper<typeof itemOffer>;
  workOffer: ResourceWrapper<typeof workOffer>;
  ranking: ResourceWrapper<typeof ranking>;
  search: ResourceWrapper<typeof search>;
  gameConfig: ResourceWrapper<typeof gameConfig>;
  user: ResourceWrapper<typeof user>;
  article: ResourceWrapper<typeof article>;
  mu: ResourceWrapper<typeof mu>;
  transaction: ResourceWrapper<typeof transaction>;
  upgrade: ResourceWrapper<typeof upgrade>;

  /**
   * Execute all queued batch requests
   * @returns Promise resolving to an array of results
   */
  runBatch: () => Promise<unknown[]>;

  /**
   * Clear the batch queue without executing
   */
  clearBatch: () => void;
}
