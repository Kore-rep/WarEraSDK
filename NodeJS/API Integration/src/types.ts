// src/types.ts

import { GetUserLiteResponse, UsersByCountryResponseDto } from 'DTOs/user.dto';
import { getArticleByIdParams, getArticlesPaginatedParams } from 'resources/article';
import { GetCompaniesParams, getCompanyByIdParams } from 'resources/company';
import { GetMessagesByArticleIdParams } from 'resources/message';
import { GetArticleByIdResponse, GetArticlesPaginatedResponse } from './DTOs/article.dto';
import { GetCompaniesResponse, GetCompanyByIdResponse } from './DTOs/company.dto';
import { GetMessagesByArticleIdResponse } from './DTOs/message.dto';
import { GetAllCountriesResponse, GetCountrybyIDResponse } from './DTOs/country.dto';
import { RegionGetRegionsObjectResponse, GetRegionbyIdResponse} from './DTOs/regions.dto';
import { getRegionByIdParams } from 'resources/region';

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
}

/**
 * Queued call information for batch requests
 */
export interface QueuedCall<T = unknown> {
  name: string;
  params: Record<string, unknown>;
  resolve: (value: T) => void;
  reject: (reason?: Error) => void;
}

/**
 * Central endpoint map - will be extended as we add types for each endpoint
 */
export type EndpointMap = {
  'company.getById': { params: getCompanyByIdParams; response: GetCompanyByIdResponse };
  'company.getCompanies': { params: GetCompaniesParams; response: GetCompaniesResponse };
  'country.getCountryById': { params: { countryId: string }; response: GetCountrybyIDResponse };
  'country.getAllCountries': { params: Record<string, never>; response: GetAllCountriesResponse };
  'government.getByCountryId': { params: { countryId: string }; response: Record<string, unknown> };
  'region.getById': { params: getRegionByIdParams; response: GetRegionbyIdResponse };
  'region.getRegionsObject': { params: Record<string, never>; response: RegionGetRegionsObjectResponse };
  'battle.getById': { params: { id: string }; response: Record<string, unknown> };
  'battle.getLiveBattleData': { params: Record<string, never>; response: Record<string, unknown> };
  'battle.getBattles': { params: Record<string, never>; response: Record<string, unknown>[] };
  'round.getById': { params: { id: string }; response: Record<string, unknown> };
  'round.getLastHits': { params: Record<string, never>; response: Record<string, unknown>[] };
  'battleRanking.getRanking': { params: Record<string, never>; response: Record<string, unknown> };
  'itemTrading.getPrices': { params: Record<string, never>; response: Record<string, unknown>[] };
  'tradingOrder.getTopOrders': { params: Record<string, never>; response: Record<string, unknown>[] };
  'itemOffer.getById': { params: { id: string }; response: Record<string, unknown> };
  'workOffer.getById': { params: { id: string }; response: Record<string, unknown> };
  'workOffer.getWorkOfferByCompanyId': { params: { companyId: string }; response: Record<string, unknown>[] };
  'workOffer.getWorkOffersPaginated': { params: { page: number; limit: number }; response: Record<string, unknown>[] };
  'ranking.getRanking': { params: Record<string, never>; response: Record<string, unknown>[] };
  'search.searchAnything': { params: { query: string }; response: Record<string, unknown>[] };
  'gameConfig.getDates': { params: Record<string, never>; response: Record<string, unknown> };
  'gameConfig.getGameConfig': { params: Record<string, never>; response: Record<string, unknown> };
  'user.getUserLite': { params: { id: string }; response: GetUserLiteResponse };
  'user.getUsersByCountry': { params: { countryId: string }; response: UsersByCountryResponseDto };
  'article.getArticleById': { params: getArticleByIdParams; response: GetArticleByIdResponse };
  'article.getArticlesPaginated': { params: getArticlesPaginatedParams; response: GetArticlesPaginatedResponse };
  'message.getMessagesByArticleId': { params: GetMessagesByArticleIdParams; response: GetMessagesByArticleIdResponse };
  'mu.getById': { params: { id: string }; response: Record<string, unknown> };
  'mu.getManyPaginated': { params: { page: number; limit: number }; response: Record<string, unknown>[] };
  'transaction.getPaginatedTransactions': { params: { page: number; limit: number }; response: Record<string, unknown>[] };
  'upgrade.getUpgradeByTypeAndEntity': { params: { type: string; entityId: string }; response: Record<string, unknown> };
};

export type EndpointName = keyof EndpointMap;
