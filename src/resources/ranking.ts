// src/resources/ranking.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates ranking resource methods bound to the provided request context.
 */
export function ranking(ctx: RequestContext) {
  return {
    getRanking: async (options?: RequestOptions): Promise<EndpointMap["ranking.getRanking"]["response"]> => {
      return await ctx.request("ranking.getRanking", {}, options?.cache);
    },
  };
}

export type RankingResource = ReturnType<typeof ranking>;
