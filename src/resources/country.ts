// src/resources/country.ts
import {
  GetAllCountriesResponse,
  GetCountryByIDResponse,
} from "../DTOs/country.dto";
import { CacheConfig } from "../cache/cacheConfig";
import { RequestContext } from "../request";

/**
 * Options for country endpoint requests
 */
export interface CountryRequestOptions {
  /**
   * Cache configuration for this specific request.
   * - `ttl`: Time-to-live in milliseconds
   * - `enabled`: Whether to cache this request (default: true)
   */
  cache?: CacheConfig;
}

/**
 * Creates country resource methods bound to the provided request context.
 */
export function country(ctx: RequestContext) {
  return {
    /**
     * Get a country by its ID
     * @param id - The country ID
     * @param options - Optional request configuration including cache settings
     */
    getCountryById: (
      id: string,
      options?: CountryRequestOptions
    ): Promise<GetCountryByIDResponse> => {
      return ctx.request("country.getCountryById", { countryId: id }, options?.cache);
    },

    /**
     * Get all countries.
     * Warning: This function is expensive, please use sparingly.
     * Consider using a longer cache TTL.
     * @param options - Optional request configuration including cache settings
     */
    getAllCountries: (
      options?: CountryRequestOptions
    ): Promise<GetAllCountriesResponse> => {
      return ctx.request("country.getAllCountries", {}, options?.cache);
    },
  };
}

export type CountryResource = ReturnType<typeof country>;
