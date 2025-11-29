// src/resources/ranking.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates ranking resource methods bound to the provided request context.
 */
export function ranking(ctx: RequestContext) {
  return {
    getRanking: async (): Promise<EndpointMap["ranking.getRanking"]["response"]> => {
      return await ctx.request("ranking.getRanking", {});
    },
  };
}

export type RankingResource = ReturnType<typeof ranking>;
