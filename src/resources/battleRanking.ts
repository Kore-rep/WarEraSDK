// src/resources/battleRanking.ts

import { GetBattleRankingParams, GetBattleRankingResponse } from "../DTOs/battleRanking.dto";
import { RequestContext } from "../request";

/**
 * Creates battle ranking resource methods bound to the provided request context.
 */
export function battleRanking(ctx: RequestContext) {
  return {
    getRanking: async (
      params: GetBattleRankingParams
    ): Promise<GetBattleRankingResponse> => {
      return await ctx.request("battleRanking.getRanking", params);
    },
  };
}

export type BattleRankingResource = ReturnType<typeof battleRanking>;
