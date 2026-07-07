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
export type {
  BattleRankingEntryDTO,
  GetBattleRankingParams,
  GetBattleRankingResponse,
} from "./DTOs/battleRanking.dto";
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
export type { GetPartyByIdResponse, PartyDTO } from "./DTOs/party.dto";
export type { GetMuByIdParams, GetMuByIdResponse, MuDTO } from "./DTOs/mu.dto";
export type { GetMessagesByArticleIdResponse } from "./DTOs/message.dto";
export type {
  GetRegionByIdResponse,
  RegionGetRegionsObjectResponse,
} from "./DTOs/regions.dto";
export type {
  GetUserLiteResponse,
  GetUsersByCountryParams,
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
export type {
  LawDTO,
  LawDataDTO,
  GetPaginatedLawsParams,
  GetPaginatedLawsResponse,
} from "./DTOs/laws.dto";
export type {
  BunkerUpgradeDTO,
  GetUpgradeByTypeAndEntityResponse,
} from "./DTOs/upgrade.dto";
export type {
  BidDTO,
  MercenaryContractAuctionDTO,
  GetPaginatedAuctionsParams,
  GetPaginatedAuctionsDataDTO,
  GetPaginatedAuctionsResponse,
} from "./DTOs/mercenaryContractAuction.dto";

// Request options (for per-request cache configuration)
export type { CountryRequestOptions } from "./resources/country";
export type { PartyRequestOptions } from "./resources/party";
export type { RegionRequestOptions } from "./resources/region";
export type { BattleRequestOptions, GetBattlesParams } from "./resources/battle";
export type { MercenaryContractAuctionRequestOptions } from "./resources/mercenaryContractAuction";

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

