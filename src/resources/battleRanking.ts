// src/resources/battleRanking.ts

import { GetBattleRankingParams, GetBattleRankingResponse } from "../DTOs/battleRanking.dto";
import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";

/**
 * Creates battle ranking resource methods bound to the provided request context.
 */
export function battleRanking(ctx: RequestContext) {
  return {
    getRanking: async (
      params: GetBattleRankingParams, options?: RequestOptions): Promise<GetBattleRankingResponse> => {
      return await ctx.request("battleRanking.getRanking", params, options?.cache);
    },
  };
}

export type BattleRankingResource = ReturnType<typeof battleRanking>;
