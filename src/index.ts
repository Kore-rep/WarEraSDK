// Main entry point for the WarEra SDK

// Client factory
export { createAPI } from "./client";

// Types
export type { APIConfig, EndpointMap, EndpointName, QueuedCall } from "./types";
export type { APIClient } from "./DTOs/api.dto";

// Cache
export type { CacheProvider } from "./cache/cacheProvider";
export type { CacheConfig } from "./cache/cacheConfig";
export { createCacheProvider } from "./cache/cacheManager";
export { NullCache } from "./cache/nullCache";

// Rate limiting
export type { RateLimitConfig } from "./rateLimit/rateLimitConfig";
export { RateLimiter, RateLimitError } from "./rateLimit/rateLimiter";
export type { RateLimiterProvider } from "./rateLimit/rateLimiterProvider";
export { createRateLimiter } from "./rateLimit";

// Errors
export { ApiError } from "./request";

// Resource types (for consumers who need them)
export type { ArticleResource } from "./resources/article";
export type { BattleResource } from "./resources/battle";
export type { BattleRankingResource } from "./resources/battleRanking";
export type { CompanyResource } from "./resources/company";
export type { CountryResource } from "./resources/country";
export type { GameConfigResource } from "./resources/gameConfig";
export type { GovernmentResource } from "./resources/government";
export type { LawsResource } from "./resources/laws";
export type { MercenaryContractAuctionResource } from "./resources/mercenaryContractAuction";
export type { ItemOfferResource } from "./resources/itemOffer";
export type { ItemTradingResource } from "./resources/itemTrading";
export type { MessageResource } from "./resources/message";
export type { PartyResource } from "./resources/party";
export type { MuResource } from "./resources/mu";
export type { RankingResource } from "./resources/ranking";
export type { RegionResource } from "./resources/region";
export type { RoundResource } from "./resources/round";
export type { SearchResource } from "./resources/search";
export type { TradingOrderResource } from "./resources/tradingOrder";
export type { TransactionResource } from "./resources/transaction";
export type { UpgradeResource } from "./resources/upgrade";
export type { UserResource } from "./resources/user";
export type { WorkOfferResource } from "./resources/workOffer";

// Request options and parameter types (defined alongside their resources)
export type { getArticleByIdParams, getArticlesPaginatedParams } from "./resources/article";
export type { BattleRequestOptions, GetBattlesParams } from "./resources/battle";
export type { getCompanyByIdParams, GetCompaniesParams } from "./resources/company";
export type { CountryRequestOptions } from "./resources/country";
export type { GetMessagesByArticleIdParams } from "./resources/message";
export type { MercenaryContractAuctionRequestOptions } from "./resources/mercenaryContractAuction";
export type { PartyRequestOptions } from "./resources/party";
export type { RegionRequestOptions, getRegionByIdParams } from "./resources/region";

// DTO types — every payload, response, and param interface the endpoints use.
// Each DTO module is re-exported wholesale so new DTOs are exposed automatically;
// APIClient lives in api.dto and is already exported above.
export type * from "./DTOs/article.dto";
export type * from "./DTOs/battle.dto";
export type * from "./DTOs/battleRanking.dto";
export type * from "./DTOs/company.dto";
export type * from "./DTOs/constants.dto";
export type * from "./DTOs/country.dto";
export type * from "./DTOs/government.dto";
export type * from "./DTOs/inventoryAccount.dto";
export type * from "./DTOs/laws.dto";
export type * from "./DTOs/mercenaryContractAuction.dto";
export type * from "./DTOs/message.dto";
export type * from "./DTOs/mu.dto";
export type * from "./DTOs/party.dto";
export type * from "./DTOs/regions.dto";
export type * from "./DTOs/transaction.dto";
export type * from "./DTOs/upgrade.dto";
export type * from "./DTOs/user.dto";
