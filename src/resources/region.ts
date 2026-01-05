// src/resources/region.ts
import {
  GetRegionByIdResponse,
  RegionGetRegionsObjectResponse,
} from "../DTOs/regions.dto";
import { CacheConfig } from "../cache/cacheConfig";
import { RequestContext } from "../request";

export interface getRegionByIdParams {
  regionid: string;
}

/**
 * Options for region endpoint requests
 */
export interface RegionRequestOptions {
  /**
   * Cache configuration for this specific request.
   * - `ttl`: Time-to-live in milliseconds
   * - `enabled`: Whether to cache this request (default: true)
   */
  cache?: CacheConfig;
}

/**
 * Creates region resource methods bound to the provided request context.
 */
export function region(ctx: RequestContext) {
  return {
    /**
     * Get a region by its ID
     * @param regionid - The region ID
     * @param options - Optional request configuration including cache settings
     */
    getById: (
      regionid: string,
      options?: RegionRequestOptions
    ): Promise<GetRegionByIdResponse> => {
      return ctx.request("region.getById", { regionid }, options?.cache);
    },

    /**
     * Get all regions as an object.
     * Warning: This function is very expensive, please use very sparingly.
     * Consider using a longer cache TTL.
     * @param options - Optional request configuration including cache settings
     */
    getRegionsObject: (
      options?: RegionRequestOptions
    ): Promise<RegionGetRegionsObjectResponse> => {
      return ctx.request("region.getRegionsObject", {}, options?.cache);
    },
  };
}

export type RegionResource = ReturnType<typeof region>;
