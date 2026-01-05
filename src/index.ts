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
export type { ItemOfferResource } from "./resources/itemOffer";
export type { ItemTradingResource } from "./resources/itemTrading";
export type { MessageResource } from "./resources/message";
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

// DTO types for consumers
export type {
  GetArticleByIdResponse,
  GetArticlesPaginatedResponse,
} from "./DTOs/article.dto";
export type {
  GetCompanyByIdResponse,
  GetCompaniesResponse,
} from "./DTOs/company.dto";
export type {
  GetCountryByIDResponse,
  GetAllCountriesResponse,
} from "./DTOs/country.dto";
export type { GetMessagesByArticleIdResponse } from "./DTOs/message.dto";
export type {
  GetRegionByIdResponse,
  RegionGetRegionsObjectResponse,
} from "./DTOs/regions.dto";
export type {
  GetUserLiteResponse,
  UsersByCountryResponseDto,
} from "./DTOs/user.dto";
export type {
  TransactionDTO,
  GetPaginatedTransactionsParams,
  GetPaginatedTransactionsResponse,
} from "./DTOs/transaction.dto";
export type {
  InventoryAccountDTO,
  InventoryAccountSpendingDTO,
  InventoryAccountIncomesDTO,
  GetInventoryAccountsParams,
  GetInventoryAccountsResponse,
} from "./DTOs/inventoryAccount.dto";
export type { InventoryAccountResource } from "./resources/inventoryAccount";
export type {
  GovernmentDTO,
  GetGovernmentByCountryIdResponse,
} from "./DTOs/government.dto";

// Request options (for per-request cache configuration)
export type { CountryRequestOptions } from "./resources/country";
export type { RegionRequestOptions } from "./resources/region";
export type { BattleRequestOptions, GetBattlesParams } from "./resources/battle";

// Parameter types
export type {
  getArticleByIdParams,
  getArticlesPaginatedParams,
} from "./resources/article";
export type {
  getCompanyByIdParams,
  GetCompaniesParams,
} from "./resources/company";
export type { GetMessagesByArticleIdParams } from "./resources/message";
export type { getRegionByIdParams } from "./resources/region";

