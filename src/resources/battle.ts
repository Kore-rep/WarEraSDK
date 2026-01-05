// src/resources/battle.ts

import { CacheConfig } from "../cache/cacheConfig";
import { RequestContext } from "../request";
import { EndpointMap } from "../types";
import { GetBattlesResponse } from "../DTOs/battle.dto";

/**
 * Parameters for getBattles endpoint
 */
export interface GetBattlesParams {
  isActive?: boolean;
  limit?: number;
  cursor?: string;
  direction?: "forward" | "backward";
  /** Filter battles. Use "all" for all battles, or provide a specific filter value. */
  filter?: string;
  defenderRegionId?: string;
  warId?: string;
  countryId?: string;
}

/**
 * Options for battle endpoint requests
 */
export interface BattleRequestOptions {
  /**
   * Cache configuration for this specific request.
   * - `ttl`: Time-to-live in milliseconds
   * - `enabled`: Whether to cache this request (default: true)
   */
  cache?: CacheConfig;
}

/**
 * Creates battle resource methods bound to the provided request context.
 */
export function battle(ctx: RequestContext) {
  return {
    /**
     * Get a battle by its ID
     * @param id - The battle ID
     * @param options - Optional request configuration including cache settings
     */
    getById: (
      id: string,
      options?: BattleRequestOptions
    ): Promise<EndpointMap["battle.getById"]["response"]> => {
      return ctx.request("battle.getById", { id }, options?.cache);
    },

    /**
     * Get live battle data
     * @param options - Optional request configuration including cache settings
     */
    getLiveBattleData: (
      options?: BattleRequestOptions
    ): Promise<EndpointMap["battle.getLiveBattleData"]["response"]> => {
      return ctx.request("battle.getLiveBattleData", {}, options?.cache);
    },

    /**
     * Get battles with optional filtering and pagination
     * @param params - Query parameters for filtering battles
     * @param options - Optional request configuration including cache settings
     */
    getBattles: (
      params?: GetBattlesParams,
      options?: BattleRequestOptions
    ): Promise<GetBattlesResponse> => {
      return ctx.request("battle.getBattles", params || {}, options?.cache);
    },
  };
}

export type BattleResource = ReturnType<typeof battle>;
