// src/resources/mercenaryContractAuction.ts

import { CacheConfig } from "../cache/cacheConfig";
import { RequestContext } from "../request";
import {
  GetPaginatedAuctionsParams,
  GetPaginatedAuctionsResponse,
} from "../DTOs/mercenaryContractAuction.dto";

/**
 * Options for mercenary contract auction endpoint requests
 */
export interface MercenaryContractAuctionRequestOptions {
  /**
   * Cache configuration for this specific request.
   * - `ttl`: Time-to-live in milliseconds
   * - `enabled`: Whether to cache this request (default: true)
   */
  cache?: CacheConfig;
}

/**
 * Creates mercenary contract auction resource methods bound to the provided request context.
 */
export function mercenaryContractAuction(ctx: RequestContext) {
  return {
    /**
     * Get paginated mercenary contract auctions with optional filtering
     * @param params - Query parameters for filtering auctions
     * @param options - Optional request configuration including cache settings
     */
    getPaginatedAuctions: (
      params?: GetPaginatedAuctionsParams,
      options?: MercenaryContractAuctionRequestOptions
    ): Promise<GetPaginatedAuctionsResponse> => {
      return ctx.request("mercenaryContractAuction.getPaginatedAuctions", params || {}, options?.cache);
    },
  };
}

export type MercenaryContractAuctionResource = ReturnType<typeof mercenaryContractAuction>;