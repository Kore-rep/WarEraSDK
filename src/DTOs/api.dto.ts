import type { ArticleResource } from "../resources/article";
import type { BattleResource } from "../resources/battle";
import type { BattleRankingResource } from "../resources/battleRanking";
import type { CompanyResource } from "../resources/company";
import type { CountryResource } from "../resources/country";
import type { GameConfigResource } from "../resources/gameConfig";
import type { GovernmentResource } from "../resources/government";
import type { InventoryAccountResource } from "../resources/inventoryAccount";
import type { ItemOfferResource } from "../resources/itemOffer";
import type { ItemTradingResource } from "../resources/itemTrading";
import type { LawsResource } from "../resources/laws";
import type { MercenaryContractAuctionResource } from "../resources/mercenaryContractAuction";
import type { MessageResource } from "../resources/message";
import type { PartyResource } from "../resources/party";
import type { MuResource } from "../resources/mu";
import type { RankingResource } from "../resources/ranking";
import type { RegionResource } from "../resources/region";
import type { RoundResource } from "../resources/round";
import type { SearchResource } from "../resources/search";
import type { TradingOrderResource } from "../resources/tradingOrder";
import type { TransactionResource } from "../resources/transaction";
import type { UpgradeResource } from "../resources/upgrade";
import type { UserResource } from "../resources/user";
import type { WorkOfferResource } from "../resources/workOffer";

/**
 * API Client interface - represents the complete API client with all resources
 */
export interface APIClient {
  company: CompanyResource;
  country: CountryResource;
  party: PartyResource;
  government: GovernmentResource;
  laws: LawsResource;
  region: RegionResource;
  battle: BattleResource;
  round: RoundResource;
  battleRanking: BattleRankingResource;
  mercenaryContractAuction: MercenaryContractAuctionResource;
  itemTrading: ItemTradingResource;
  tradingOrder: TradingOrderResource;
  itemOffer: ItemOfferResource;
  workOffer: WorkOfferResource;
  ranking: RankingResource;
  search: SearchResource;
  gameConfig: GameConfigResource;
  user: UserResource;
  article: ArticleResource;
  message: MessageResource;
  mu: MuResource;
  transaction: TransactionResource;
  upgrade: UpgradeResource;
  inventoryAccount: InventoryAccountResource;

  /**
   * Execute all queued batch requests. Each queued call resolves or rejects independently.
   * @param ttl - Optional TTL in milliseconds for caching batch results
   */
  runBatch: (ttl?: number) => Promise<unknown[]>;

  /**
   * Clear the batch queue without executing
   */
  clearBatch: () => void;

  /**
   * Invalidate a specific cache key
   */
  invalidateCache: (
    endpointName: string,
    params: Record<string, unknown>
  ) => Promise<void>;

  /**
   * Get current rate limit status.
   * Returns null if rate limiting is not enabled.
   */
  getRateLimitStatus: () => {
    requestCount: number;
    maxRequests: number;
    usagePercent: number;
    isAtLimit: boolean;
    currentBackoffMs: number;
  } | null;
}
