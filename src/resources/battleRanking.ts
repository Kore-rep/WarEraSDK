// src/resources/battleRanking.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates battle ranking resource methods bound to the provided request context.
 */
export function battleRanking(ctx: RequestContext) {
  return {
    getRanking: async (): Promise<EndpointMap["battleRanking.getRanking"]["response"]> => {
      return await ctx.request("battleRanking.getRanking", {});
    },
  };
}

export type BattleRankingResource = ReturnType<typeof battleRanking>;
