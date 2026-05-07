// src/types.ts

import {
  GetUserLiteResponse,
  GetUsersByCountryParams,
  UsersByCountryResponseDto,
} from "./DTOs/user.dto";
import {
  getArticleByIdParams,
  getArticlesPaginatedParams,
} from "./resources/article";
import { GetCompaniesParams, getCompanyByIdParams } from "./resources/company";
import { GetMessagesByArticleIdParams } from "./resources/message";
import { GetBattlesParams } from "./resources/battle";
import {
  GetArticleByIdResponse,
  GetArticlesPaginatedResponse,
} from "./DTOs/article.dto";
import { GetBattlesResponse } from "./DTOs/battle.dto";
import {
  GetCompaniesResponse,
  GetCompanyByIdResponse,
} from "./DTOs/company.dto";
import { GetMessagesByArticleIdResponse } from "./DTOs/message.dto";
import {
  GetAllCountriesResponse,
  GetCountryByIDResponse,
} from "./DTOs/country.dto";
import {
  RegionGetRegionsObjectResponse,
  GetRegionByIdResponse,
} from "./DTOs/regions.dto";
import { getRegionByIdParams } from "./resources/region";
import {
  GetPaginatedTransactionsParams,
  GetPaginatedTransactionsResponse,
} from "./DTOs/transaction.dto";
import {
  GetInventoryAccountsParams,
  GetInventoryAccountsResponse,
} from "./DTOs/inventoryAccount.dto";
import { GetGovernmentByCountryIdResponse } from "./DTOs/government.dto";
import {
  GetPaginatedLawsParams,
  GetPaginatedLawsResponse,
} from "./DTOs/laws.dto";
import { GetUpgradeByTypeAndEntityResponse } from "./DTOs/upgrade.dto";
import { GetPartyByIdResponse } from "./DTOs/party.dto";
import {
  GetBattleRankingParams,
  GetBattleRankingResponse,
} from "./DTOs/battleRanking.dto";
import {
  GetPaginatedAuctionsParams,
  GetPaginatedAuctionsResponse,
} from "./DTOs/mercenaryContractAuction.dto";
import { RateLimitConfig, RateLimiterProvider } from "./rateLimit";
import { CacheProvider } from "./cache/cacheProvider";

/*
 * Configuration for the API client
 */
export interface APIConfig {
  baseUrl?: string;
  timeout?: number;
  batch?: boolean;
  retry?: {
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
  };
  /**
   * Cache configuration.
   * - `undefined` (default): Uses in-memory cache
   * - `null`: Disables caching
   * - `CacheProvider`: Uses custom cache provider
   */
  cache?: CacheProvider | null;
  /**
   * Default TTL for cache entries in milliseconds.
   * @default 30000
   */
  cacheTTL?: number;
  /**
   * Custom rate limiter provider implementation.
   * If provided, this will be used instead of creating a built-in rate limiter.
   * - `undefined` (default): Use rateLimitConfig if provided, otherwise no rate limiting
   * - `null`: Explicitly disable rate limiting (overrides rateLimitConfig)
   * - `RateLimiterProvider`: Use custom rate limiter implementation
   */
  rateLimiter?: RateLimiterProvider | null;
  /**
   * Rate limiting configuration for built-in rate limiter.
   * Only used if rateLimiter is not provided.
   * - `undefined` (default): No rate limiting
   * - `Partial<RateLimitConfig>`: Use built-in rate limiter with provided config
   */
  rateLimitConfig?: Partial<RateLimitConfig>;
  /**
   * Optional API key for authentication.
   * If provided, will be sent with every request as the X-API-Key header.
   */
  apiKey?: string;
}

/**
 * Queued call information for batch requests
 */
export interface QueuedCall<T = unknown> {
  name: string;
  params: Record<string, unknown>;
  resolve: (value: T) => void;
  reject: (reason?: Error) => void;
  /** Optional TTL in milliseconds for caching this specific request */
  ttl?: number;
}

/**
 * Central endpoint map - will be extended as we add types for each endpoint
 */
export type EndpointMap = {
  "company.getById": {
    params: getCompanyByIdParams;
    response: GetCompanyByIdResponse;
  };
  "company.getCompanies": {
    params: GetCompaniesParams;
    response: GetCompaniesResponse;
  };
  "country.getCountryById": {
    params: { countryId: string };
    response: GetCountryByIDResponse;
  };
  "country.getAllCountries": {
    params: Record<string, never>;
    response: GetAllCountriesResponse;
  };
  "party.getById": {
    params: { partyId: string };
    response: GetPartyByIdResponse;
  };
  "government.getByCountryId": {
    params: { countryId: string };
    response: GetGovernmentByCountryIdResponse;
  };
  "law.getPaginatedLaws": {
    params: GetPaginatedLawsParams;
    response: GetPaginatedLawsResponse;
  };
  "region.getById": {
    params: getRegionByIdParams;
    response: GetRegionByIdResponse;
  };
  "region.getRegionsObject": {
    params: Record<string, never>;
    response: RegionGetRegionsObjectResponse;
  };
  "battle.getById": {
    params: { id: string };
    response: Record<string, unknown>;
  };
  "battle.getLiveBattleData": {
    params: Record<string, never>;
    response: Record<string, unknown>;
  };
  "battle.getBattles": {
    params: GetBattlesParams;
    response: GetBattlesResponse;
  };
  "round.getById": {
    params: { id: string };
    response: Record<string, unknown>;
  };
  "round.getLastHits": {
    params: Record<string, never>;
    response: Record<string, unknown>[];
  };
  "battleRanking.getRanking": {
    params: GetBattleRankingParams;
    response: GetBattleRankingResponse;
  };
  "itemTrading.getPrices": {
    params: Record<string, never>;
    response: Record<string, unknown>[];
  };
  "tradingOrder.getTopOrders": {
    params: Record<string, never>;
    response: Record<string, unknown>[];
  };
  "itemOffer.getById": {
    params: { id: string };
    response: Record<string, unknown>;
  };
  "workOffer.getById": {
    params: { id: string };
    response: Record<string, unknown>;
  };
  "workOffer.getWorkOfferByCompanyId": {
    params: { companyId: string };
    response: Record<string, unknown>[];
  };
  "workOffer.getWorkOffersPaginated": {
    params: { page: number; limit: number };
    response: Record<string, unknown>[];
  };
  "ranking.getRanking": {
    params: Record<string, never>;
    response: Record<string, unknown>[];
  };
  "search.searchAnything": {
    params: { query: string };
    response: Record<string, unknown>[];
  };
  "gameConfig.getDates": {
    params: Record<string, never>;
    response: Record<string, unknown>;
  };
  "gameConfig.getGameConfig": {
    params: Record<string, never>;
    response: Record<string, unknown>;
  };
  "user.getUserLite": {
    params: { userId: string };
    response: GetUserLiteResponse;
  };
  "user.getUsersByCountry": {
    params: GetUsersByCountryParams;
    response: UsersByCountryResponseDto;
  };
  "article.getArticleById": {
    params: getArticleByIdParams;
    response: GetArticleByIdResponse;
  };
  "article.getArticlesPaginated": {
    params: getArticlesPaginatedParams;
    response: GetArticlesPaginatedResponse;
  };
  "message.getMessagesByArticleId": {
    params: GetMessagesByArticleIdParams;
    response: GetMessagesByArticleIdResponse;
  };
  "mu.getById": { params: { id: string }; response: Record<string, unknown> };
  "mu.getManyPaginated": {
    params: { page: number; limit: number };
    response: Record<string, unknown>[];
  };
  "transaction.getPaginatedTransactions": {
    params: GetPaginatedTransactionsParams;
    response: GetPaginatedTransactionsResponse;
  };
  "upgrade.getUpgradeByTypeAndEntity": {
    params: { upgradeType: string; regionId: string };
    response: GetUpgradeByTypeAndEntityResponse;
  };
  "inventoryAccount.getInventoryAccounts": {
    params: GetInventoryAccountsParams;
    response: GetInventoryAccountsResponse;
  };
  "mercenaryContractAuction.getPaginatedAuctions": {
    params: GetPaginatedAuctionsParams;
    response: GetPaginatedAuctionsResponse;
  };
};

export type EndpointName = keyof EndpointMap;
