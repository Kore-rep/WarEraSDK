import { GetPartyByIdResponse } from "../DTOs/party.dto";
import { CacheConfig } from "../cache/cacheConfig";
import { RequestContext } from "../request";

/**
 * Options for party endpoint requests
 */
export interface PartyRequestOptions {
  /**
   * Cache configuration for this specific request.
   * - `ttl`: Time-to-live in milliseconds
   * - `enabled`: Whether to cache this request (default: true)
   */
  cache?: CacheConfig;
}

/**
 * Creates party resource methods bound to the provided request context.
 */
export function party(ctx: RequestContext) {
  return {
    /**
     * Get a party by its ID
     * @param id - The party ID
     * @param options - Optional request configuration including cache settings
     */
    getPartyById: (
      id: string,
      options?: PartyRequestOptions
    ): Promise<GetPartyByIdResponse> => {
      return ctx.request("party.getById", { partyId: id }, options?.cache);
    },
  };
}

export type PartyResource = ReturnType<typeof party>;
